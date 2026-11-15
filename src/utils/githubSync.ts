/**
 * Smile7 Dental Clinic - GitHub Cloud Database Sync Engine
 * Enables seamless, real-time bidirectional sync between Laptop, Android, and iOS.
 */

export interface GitHubSyncConfig {
  token: string;
  owner: string;
  repo: string;
  branch: string;
  filePath: string;
  encryptionPin?: string;
  autoSync: boolean;
  lastSyncTime?: string;
  lastSyncStatus?: 'idle' | 'syncing' | 'success' | 'error';
  lastError?: string;
}

const CONFIG_STORAGE_KEY = 'smile7_github_sync_config';

export const DEFAULT_SYNC_CONFIG: GitHubSyncConfig = {
  token: '',
  owner: 'Rajrkrisna',
  repo: 'smile7dental',
  branch: 'clinic-data',
  filePath: 'database/smile7-clinic-db.json',
  encryptionPin: '',
  autoSync: true,
  lastSyncStatus: 'idle'
};

// Safe UTF-8 Base64 Encoders for GitHub API
export function utf8ToBase64(str: string): string {
  return btoa(
    encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, (_, p1) =>
      String.fromCharCode(parseInt(p1, 16))
    )
  );
}

export function base64ToUtf8(str: string): string {
  // Strip whitespace/newlines that GitHub API might return in base64
  const clean = str.replace(/\s/g, '');
  return decodeURIComponent(
    atob(clean)
      .split('')
      .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
      .join('')
  );
}

// Client-side AES-GCM-256 Encryption (Native Web Crypto API)
async function deriveKey(pin: string, salt: Uint8Array): Promise<CryptoKey> {
  const enc = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    enc.encode(pin),
    'PBKDF2',
    false,
    ['deriveKey']
  );
  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: salt as any,
      iterations: 100000,
      hash: 'SHA-256'
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}

export async function encryptData(plainText: string, pin: string): Promise<string> {
  if (!pin || pin.trim() === '') return plainText;
  try {
    const enc = new TextEncoder();
    const salt = crypto.getRandomValues(new Uint8Array(16));
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const key = await deriveKey(pin, salt);

    const ciphertext = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv: iv as any },
      key,
      enc.encode(plainText)
    );

    const payload = {
      isEncrypted: true,
      salt: Array.from(salt),
      iv: Array.from(iv),
      data: Array.from(new Uint8Array(ciphertext))
    };
    return JSON.stringify(payload);
  } catch (err) {
    console.error('Encryption failed:', err);
    return plainText;
  }
}

export async function decryptData(rawContent: string, pin: string): Promise<string> {
  try {
    const parsed = JSON.parse(rawContent);
    if (!parsed || !parsed.isEncrypted || !parsed.salt || !parsed.iv || !parsed.data) {
      // Not encrypted format, return as is
      return rawContent;
    }

    if (!pin || pin.trim() === '') {
      throw new Error('This clinic database is encrypted. Please enter the Clinic Master PIN in Settings to decrypt.');
    }

    const salt = new Uint8Array(parsed.salt);
    const iv = new Uint8Array(parsed.iv);
    const ciphertext = new Uint8Array(parsed.data);
    const key = await deriveKey(pin, salt);

    const decrypted = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv: iv as any },
      key,
      ciphertext as any
    );

    return new TextDecoder().decode(decrypted);
  } catch (err) {
    if (typeof rawContent === 'string' && rawContent.startsWith('{') && rawContent.includes('"clinicProfile"')) {
      return rawContent; // Plain JSON fallback
    }
    throw err;
  }
}

// Storage Management
export function getSyncConfig(): GitHubSyncConfig {
  try {
    const saved = localStorage.getItem(CONFIG_STORAGE_KEY);
    if (saved) {
      return { ...DEFAULT_SYNC_CONFIG, ...JSON.parse(saved) };
    }
  } catch {}
  return DEFAULT_SYNC_CONFIG;
}

export function saveSyncConfig(config: Partial<GitHubSyncConfig>): GitHubSyncConfig {
  const current = getSyncConfig();
  const updated = { ...current, ...config };
  localStorage.setItem(CONFIG_STORAGE_KEY, JSON.stringify(updated));
  return updated;
}

// GitHub API Interactions
export async function testGitHubConnection(config: GitHubSyncConfig): Promise<{ success: boolean; message: string; username?: string }> {
  if (!config.token || config.token.trim() === '') {
    return { success: false, message: 'Please enter a GitHub Personal Access Token.' };
  }

  try {
    // 1. Check user authentication
    const userRes = await fetch('https://api.github.com/user', {
      headers: {
        Authorization: `Bearer ${config.token.trim()}`,
        Accept: 'application/vnd.github.v3+json'
      }
    });

    if (!userRes.ok) {
      return { success: false, message: `Authentication failed (Status ${userRes.status}). Verify your token.` };
    }

    const userData = await userRes.json();

    // 2. Check repo access
    const repoRes = await fetch(`https://api.github.com/repos/${config.owner}/${config.repo}`, {
      headers: {
        Authorization: `Bearer ${config.token.trim()}`,
        Accept: 'application/vnd.github.v3+json'
      }
    });

    if (!repoRes.ok) {
      return { 
        success: false, 
        message: `Token valid for @${userData.login}, but cannot access repository ${config.owner}/${config.repo}. Ensure token has 'repo' scope.` 
      };
    }

    return { 
      success: true, 
      message: `Connected successfully as @${userData.login}! Repository ${config.owner}/${config.repo} accessible.`,
      username: userData.login
    };
  } catch (err: any) {
    return { success: false, message: `Network error: ${err.message || 'Cannot reach GitHub API'}` };
  }
}

export async function fetchFromGitHub(config: GitHubSyncConfig): Promise<{
  exists: boolean;
  sha?: string;
  data?: any;
  rawJson?: string;
}> {
  if (!config.token) throw new Error('GitHub token not configured');

  const url = `https://api.github.com/repos/${config.owner}/${config.repo}/contents/${config.filePath}?ref=${config.branch}`;
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${config.token.trim()}`,
      Accept: 'application/vnd.github.v3+json'
    }
  });

  if (res.status === 404) {
    return { exists: false };
  }

  if (!res.ok) {
    const errorBody = await res.text();
    throw new Error(`Failed to fetch database from GitHub (${res.status}): ${errorBody}`);
  }

  const json = await res.json();
  const decodedContent = base64ToUtf8(json.content);
  const decryptedJson = await decryptData(decodedContent, config.encryptionPin || '');
  const parsedData = JSON.parse(decryptedJson);

  return {
    exists: true,
    sha: json.sha,
    data: parsedData,
    rawJson: decryptedJson
  };
}

export async function pushToGitHub(
  dataJsonString: string,
  config: GitHubSyncConfig,
  commitMessage: string = 'sync: update clinic database [skip ci]'
): Promise<{ sha: string }> {
  if (!config.token) throw new Error('GitHub token not configured');

  // Check if file already exists to get SHA
  let existingSha: string | undefined = undefined;
  try {
    const current = await fetchFromGitHub(config);
    if (current.exists) {
      existingSha = current.sha;
    }
  } catch {}

  // Encrypt if PIN configured
  const contentToUpload = await encryptData(dataJsonString, config.encryptionPin || '');
  const base64Content = utf8ToBase64(contentToUpload);

  const url = `https://api.github.com/repos/${config.owner}/${config.repo}/contents/${config.filePath}`;
  const body: any = {
    message: commitMessage,
    content: base64Content,
    branch: config.branch
  };

  if (existingSha) {
    body.sha = existingSha;
  }

  const res = await fetch(url, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${config.token.trim()}`,
      Accept: 'application/vnd.github.v3+json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Failed to save database to GitHub (${res.status}): ${errText}`);
  }

  const result = await res.json();
  return { sha: result.content?.sha || '' };
}

/**
 * Intelligent Entity Merger:
 * Merges local and remote clinic databases without losing records.
 */
export function mergeDatabases(local: any, remote: any): any {
  if (!remote) return local;
  if (!local) return remote;

  const mergeArrayById = (localArr: any[] = [], remoteArr: any[] = []): any[] => {
    const map = new Map<string, any>();

    // Add local records
    for (const item of localArr) {
      if (item && item.id) {
        map.set(item.id, item);
      }
    }

    // Merge remote records
    for (const item of remoteArr) {
      if (item && item.id) {
        const existing = map.get(item.id);
        if (!existing) {
          map.set(item.id, item);
        } else {
          // Both exist: pick the one with later updatedAt or date or higher paid amount
          const localTime = new Date(existing.updatedAt || existing.date || existing.createdAt || 0).getTime();
          const remoteTime = new Date(item.updatedAt || item.date || item.createdAt || 0).getTime();

          if (remoteTime > localTime) {
            map.set(item.id, { ...existing, ...item });
          } else if (item.paidAmount && item.paidAmount > (existing.paidAmount || 0)) {
            // Keep higher paid amount if invoice was settled on another device
            map.set(item.id, { ...existing, ...item });
          }
        }
      }
    }

    return Array.from(map.values());
  };

  return {
    version: '1.0.0',
    exportedAt: new Date().toISOString(),
    clinicProfile: remote.clinicProfile || local.clinicProfile,
    notation: remote.notation || local.notation,
    patients: mergeArrayById(local.patients, remote.patients),
    appointments: mergeArrayById(local.appointments, remote.appointments),
    clinicalNotes: mergeArrayById(local.clinicalNotes, remote.clinicalNotes),
    prescriptions: mergeArrayById(local.prescriptions, remote.prescriptions),
    invoices: mergeArrayById(local.invoices, remote.invoices),
    procedures: mergeArrayById(local.procedures, remote.procedures),
    consultantPayouts: mergeArrayById(local.consultantPayouts, remote.consultantPayouts),
    labWorkOrders: mergeArrayById(local.labWorkOrders, remote.labWorkOrders),
    generalExpenses: mergeArrayById(local.generalExpenses, remote.generalExpenses),
    patientVisits: mergeArrayById(local.patientVisits, remote.patientVisits)
  };
}
