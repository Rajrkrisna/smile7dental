using System;
using System.IO;
using System.Net;
using System.Net.Sockets;
using System.Text;
using System.Threading;
using System.Diagnostics;
using System.Windows.Forms;
using System.Drawing;

namespace Smile7Dental
{
    static class Program
    {
        private static HttpListener _listener;
        private static bool _isRunning = true;
        private static string _distPath;
        private static int _port = 4500;

        [STAThread]
        static void Main(string[] args)
        {
            Application.EnableVisualStyles();
            Application.SetCompatibleTextRenderingDefault(false);

            // Single Instance Check
            bool isNewInstance;
            using (Mutex mutex = new Mutex(true, "Smile7DentalClinicSingleInstanceMutex", out isNewInstance))
            {
                if (!isNewInstance)
                {
                    // Already running - open app window
                    LaunchEdgeOrChrome("http://127.0.0.1:" + _port);
                    return;
                }

                // Locate dist folder
                string baseDir = AppDomain.CurrentDomain.BaseDirectory;
                _distPath = Path.Combine(baseDir, "dist");
                if (!Directory.Exists(_distPath))
                {
                    try
                    {
                        string parentDist = Path.Combine(Directory.GetParent(baseDir).FullName, "dist");
                        if (Directory.Exists(parentDist))
                        {
                            _distPath = parentDist;
                        }
                    }
                    catch {}
                }

                if (!Directory.Exists(_distPath))
                {
                    MessageBox.Show(
                        "Cannot find 'dist' folder next to Smile7Dental.exe.\nPlease ensure the application build files exist.",
                        "Smile7 Dental Clinic",
                        MessageBoxButtons.OK,
                        MessageBoxIcon.Error
                    );
                    return;
                }

                // Find available port
                _port = FindAvailablePort(4500, 4550);

                // Start local offline HttpListener
                _listener = new HttpListener();
                _listener.Prefixes.Add("http://127.0.0.1:" + _port + "/");
                try
                {
                    _listener.Start();
                }
                catch (Exception ex)
                {
                    MessageBox.Show(
                        "Unable to start offline service on port " + _port + ":\n" + ex.Message,
                        "Smile7 Dental Clinic",
                        MessageBoxButtons.OK,
                        MessageBoxIcon.Error
                    );
                    return;
                }

                // Start background worker to serve static files
                Thread worker = new Thread(ListenLoop);
                worker.IsBackground = true;
                worker.Start();

                string appUrl = "http://127.0.0.1:" + _port;

                // Create System Tray Icon
                NotifyIcon trayIcon = new NotifyIcon();
                trayIcon.Text = "Smile7 Dental Clinic";
                
                string icoPath = Path.Combine(baseDir, "app.ico");
                if (File.Exists(icoPath))
                {
                    try { trayIcon.Icon = new Icon(icoPath); } catch {}
                }
                if (trayIcon.Icon == null)
                {
                    trayIcon.Icon = SystemIcons.Application;
                }

                ContextMenu menu = new ContextMenu();
                menu.MenuItems.Add("Open Smile7 Dental Clinic", (s, e) => LaunchEdgeOrChrome(appUrl));
                menu.MenuItems.Add("-");
                menu.MenuItems.Add("Exit Application", (s, e) => {
                    _isRunning = false;
                    try { trayIcon.Visible = false; } catch {}
                    Application.Exit();
                });
                trayIcon.ContextMenu = menu;
                trayIcon.DoubleClick += (s, e) => LaunchEdgeOrChrome(appUrl);
                trayIcon.Visible = true;

                // Launch dedicated desktop window
                Process browserProc = LaunchEdgeOrChrome(appUrl);

                if (browserProc != null)
                {
                    // Monitor browser process on separate thread
                    Thread monitor = new Thread(() =>
                    {
                        try
                        {
                            browserProc.WaitForExit();
                        }
                        catch {}
                        _isRunning = false;
                        try { trayIcon.Visible = false; } catch {}
                        try
                        {
                            if (_listener != null && _listener.IsListening)
                            {
                                _listener.Stop();
                                _listener.Close();
                            }
                        }
                        catch {}
                        Application.Exit();
                    });
                    monitor.IsBackground = true;
                    monitor.Start();
                }

                Application.Run();

                _isRunning = false;
                try { trayIcon.Visible = false; } catch {}
                try
                {
                    if (_listener != null && _listener.IsListening)
                    {
                        _listener.Stop();
                        _listener.Close();
                    }
                }
                catch {}
            }
        }

        private static int FindAvailablePort(int startPort, int endPort)
        {
            for (int p = startPort; p <= endPort; p++)
            {
                try
                {
                    TcpListener tcp = new TcpListener(IPAddress.Loopback, p);
                    tcp.Start();
                    tcp.Stop();
                    return p;
                }
                catch {}
            }
            return 4500;
        }

        private static void ListenLoop()
        {
            while (_isRunning)
            {
                try
                {
                    HttpListenerContext ctx = _listener.GetContext();
                    ThreadPool.QueueUserWorkItem((obj) => HandleRequest((HttpListenerContext)obj), ctx);
                }
                catch
                {
                    if (!_isRunning) break;
                }
            }
        }

        private static void HandleRequest(HttpListenerContext ctx)
        {
            try
            {
                string rawUrl = ctx.Request.Url.AbsolutePath;

                // Built-in URL shortener bridge (calls TinyURL without CORS limitations)
                if (rawUrl.Equals("/api/shorten", StringComparison.OrdinalIgnoreCase))
                {
                    string longUrl = ctx.Request.QueryString["url"];
                    string shortUrl = null;
                    if (!string.IsNullOrEmpty(longUrl))
                    {
                        try
                        {
                            HttpWebRequest req = (HttpWebRequest)WebRequest.Create("https://tinyurl.com/api-create.php?url=" + Uri.EscapeDataString(longUrl));
                            req.Timeout = 4000;
                            req.UserAgent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64)";
                            using (WebResponse resp = req.GetResponse())
                            using (Stream s = resp.GetResponseStream())
                            using (StreamReader r = new StreamReader(s))
                            {
                                string res = r.ReadToEnd().Trim();
                                if (res.StartsWith("http://", StringComparison.OrdinalIgnoreCase) || res.StartsWith("https://", StringComparison.OrdinalIgnoreCase))
                                {
                                    shortUrl = res;
                                }
                            }
                        }
                        catch {}
                    }

                    ctx.Response.ContentType = "application/json; charset=utf-8";
                    ctx.Response.Headers["Access-Control-Allow-Origin"] = "*";
                    ctx.Response.Headers["Cache-Control"] = "no-cache";
                    string json = shortUrl != null 
                        ? "{\"success\":true,\"shortUrl\":\"" + shortUrl.Replace("\"", "\\\"") + "\"}" 
                        : "{\"success\":false,\"shortUrl\":null}";
                    byte[] jsonBytes = Encoding.UTF8.GetBytes(json);
                    ctx.Response.StatusCode = 200;
                    ctx.Response.OutputStream.Write(jsonBytes, 0, jsonBytes.Length);
                    return;
                }

                string relPath = rawUrl.TrimStart('/');
                if (string.IsNullOrEmpty(relPath))
                {
                    relPath = "index.html";
                }

                string filePath = Path.Combine(_distPath, relPath.Replace('/', Path.DirectorySeparatorChar));

                // Fallback for SPA routing: if file does not exist and doesn't have an extension, serve index.html
                if (!File.Exists(filePath))
                {
                    if (!Path.HasExtension(relPath))
                    {
                        filePath = Path.Combine(_distPath, "index.html");
                    }
                }

                if (File.Exists(filePath))
                {
                    byte[] bytes = File.ReadAllBytes(filePath);
                    string ext = Path.GetExtension(filePath).ToLowerInvariant();
                    string mime = GetMimeType(ext);

                    ctx.Response.ContentType = mime;
                    ctx.Response.ContentLength64 = bytes.Length;
                    ctx.Response.Headers["Access-Control-Allow-Origin"] = "*";
                    ctx.Response.Headers["Cache-Control"] = "no-cache";
                    ctx.Response.StatusCode = 200;
                    ctx.Response.OutputStream.Write(bytes, 0, bytes.Length);
                }
                else
                {
                    ctx.Response.StatusCode = 404;
                    byte[] notFound = Encoding.UTF8.GetBytes("Not Found");
                    ctx.Response.OutputStream.Write(notFound, 0, notFound.Length);
                }
            }
            catch {}
            finally
            {
                try { ctx.Response.OutputStream.Close(); } catch {}
            }
        }

        private static string GetMimeType(string ext)
        {
            switch (ext)
            {
                case ".html": return "text/html; charset=utf-8";
                case ".js": return "application/javascript; charset=utf-8";
                case ".mjs": return "application/javascript; charset=utf-8";
                case ".css": return "text/css; charset=utf-8";
                case ".png": return "image/png";
                case ".jpg":
                case ".jpeg": return "image/jpeg";
                case ".gif": return "image/gif";
                case ".svg": return "image/svg+xml";
                case ".ico": return "image/x-icon";
                case ".json": return "application/json; charset=utf-8";
                case ".woff": return "font/woff";
                case ".woff2": return "font/woff2";
                case ".ttf": return "font/ttf";
                default: return "application/octet-stream";
            }
        }

        private static Process LaunchEdgeOrChrome(string url)
        {
            string edge1 = @"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe";
            string edge2 = @"C:\Program Files\Microsoft\Edge\Application\msedge.exe";
            string chrome1 = @"C:\Program Files\Google\Chrome\Application\chrome.exe";
            string chrome2 = @"C:\Program Files (x86)\Google\Chrome\Application\chrome.exe";
            string localChrome = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData), @"Google\Chrome\Application\chrome.exe");

            string browserExe = null;
            if (File.Exists(edge1)) browserExe = edge1;
            else if (File.Exists(edge2)) browserExe = edge2;
            else if (File.Exists(chrome1)) browserExe = chrome1;
            else if (File.Exists(chrome2)) browserExe = chrome2;
            else if (File.Exists(localChrome)) browserExe = localChrome;

            string userDataDir = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData), "Smile7DentalApp", "Profile");

            if (browserExe != null)
            {
                ProcessStartInfo psi = new ProcessStartInfo();
                psi.FileName = browserExe;
                psi.Arguments = string.Format("--app=\"{0}\" --user-data-dir=\"{1}\" --window-size=1360,860", url, userDataDir);
                psi.UseShellExecute = false;
                try
                {
                    return Process.Start(psi);
                }
                catch
                {
                    return Process.Start(url);
                }
            }
            else
            {
                return Process.Start(url);
            }
        }
    }
}

