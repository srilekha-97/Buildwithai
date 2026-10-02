export type LocalUser = {
  id: string;
  email: string;
  name: string;
};

type StoredUser = LocalUser & {
  passwordHash: string;
};

export type LocalProfile = {
  display_name: string;
  grade: string;
  avatar_url: string;
};

const USERS_KEY = "eduadapt_local_users";
const CURRENT_USER_KEY = "eduadapt_current_user";
const PROFILES_KEY = "eduadapt_local_profiles";

function readUsers(): StoredUser[] {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
  } catch {
    return [];
  }
}

function writeUsers(users: StoredUser[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function readProfiles(): Record<string, LocalProfile> {
  try {
    return JSON.parse(localStorage.getItem(PROFILES_KEY) || "{}");
  } catch {
    return {};
  }
}

async function hashPassword(password: string): Promise<string> {
  const bytes = new TextEncoder().encode(password);
  const hash = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export function getCurrentUser(): LocalUser | null {
  try {
    const raw = localStorage.getItem(CURRENT_USER_KEY);
    return raw ? (JSON.parse(raw) as LocalUser) : null;
  } catch {
    return null;
  }
}

export async function signUpLocal(
  email: string,
  password: string,
  name: string,
): Promise<{ user?: LocalUser; error?: string }> {
  const normalizedEmail = email.trim().toLowerCase();
  const users = readUsers();

  if (users.some((u) => u.email === normalizedEmail)) {
    return { error: "An account with this email already exists. Please sign in." };
  }

  const user: LocalUser = {
    id: crypto.randomUUID(),
    email: normalizedEmail,
    name: name.trim(),
  };

  users.push({
    ...user,
    passwordHash: await hashPassword(password),
  });
  writeUsers(users);
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));

  const profiles = readProfiles();
  profiles[user.id] = {
    display_name: user.name,
    grade: "",
    avatar_url: "",
  };
  localStorage.setItem(PROFILES_KEY, JSON.stringify(profiles));

  return { user };
}

export async function signInLocal(
  email: string,
  password: string,
): Promise<{ user?: LocalUser; error?: string }> {
  const normalizedEmail = email.trim().toLowerCase();
  const passwordHash = await hashPassword(password);
  const user = readUsers().find(
    (u) => u.email === normalizedEmail && u.passwordHash === passwordHash,
  );

  if (!user) {
    return { error: "Invalid email or password." };
  }

  const sessionUser: LocalUser = {
    id: user.id,
    email: user.email,
    name: user.name,
  };

  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(sessionUser));
  return { user: sessionUser };
}

export function signOutLocal() {
  localStorage.removeItem(CURRENT_USER_KEY);
}

export function getLocalProfile(userId: string): LocalProfile {
  const profiles = readProfiles();
  return (
    profiles[userId] || {
      display_name: "",
      grade: "",
      avatar_url: "",
    }
  );
}

export function saveLocalProfile(userId: string, profile: LocalProfile) {
  const profiles = readProfiles();
  profiles[userId] = profile;
  localStorage.setItem(PROFILES_KEY, JSON.stringify(profiles));
}
