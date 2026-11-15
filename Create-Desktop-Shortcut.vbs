Set WshShell = CreateObject("WScript.Shell")
strDesktop = WshShell.SpecialFolders("Desktop")
Set oShellLink = WshShell.CreateShortcut(strDesktop & "\Smile7 Dental Clinic.lnk")
oShellLink.TargetPath = "C:\Users\rajrk\.gemini\antigravity\scratch\dental-clinic-desktop\Smile7Dental.exe"
oShellLink.WorkingDirectory = "C:\Users\rajrk\.gemini\antigravity\scratch\dental-clinic-desktop"
oShellLink.WindowStyle = 1
oShellLink.Description = "Smile7 Dental Clinic - Practice Management System (Dr. P. Manickapriya)"
oShellLink.IconLocation = "C:\Users\rajrk\.gemini\antigravity\scratch\dental-clinic-desktop\app.ico,0"
oShellLink.Save
WScript.Echo "Smile7 Dental Clinic Desktop Shortcut pointing to Smile7Dental.exe has been created on your Windows Desktop!"
