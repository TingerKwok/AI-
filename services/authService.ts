/**
 * Mock Authentication Service
 *
 * This service simulates a backend for user authentication and activation.
 * It uses localStorage to persist data, making the user experience consistent
 * across page reloads.
 *
 * TO CONNECT TO YOUR DRIZZLE BACKEND:
 * 1. Set up your backend server with endpoints like:
 *    - POST /api/auth/otp (sends an OTP to a phone number)
 *    - POST /api/auth/verify (verifies OTP, returns a user object and JWT)
 *    - POST /api/verify-activation (verifies a Weidian code for a logged-in user)
 *    - GET /api/me (returns the current user's status)
 * 2. Replace the logic in each function below with `fetch` calls to your API endpoints.
 * 3. Instead of storing the user object in localStorage directly, store the JWT
 *    and include it in the Authorization header of subsequent requests.
 */

const USER_SESSION_KEY = 'pronunciation_coach_user_session';
const DB_USERS_KEY = 'pronunciation_coach_db_users';
const DB_CODES_KEY = 'pronunciation_coach_db_codes';

// --- Helper Functions to Simulate Database ---

// Initialize a mock database of valid, one-time activation codes.
// In a real app, your Drizzle backend would manage this in a database table.
const initializeMockCodes = () => {
  if (!localStorage.getItem(DB_CODES_KEY)) {
    const codes = Array.from({ length: 10000 }, (_, i) => ({
      code: String(i).padStart(6, '0'), // e.g., '000000', '000001'
      used: false,
    }));
    localStorage.setItem(DB_CODES_KEY, JSON.stringify(codes));
  }
};
initializeMockCodes();

const getMockUsers = (): { [phone: string]: { activated: boolean } } => {
  return JSON.parse(localStorage.getItem(DB_USERS_KEY) || '{}');
};
const saveMockUsers = (users: object) => {
  localStorage.setItem(DB_USERS_KEY, JSON.stringify(users));
};

// --- Service Functions ---

/**
 * Simulates sending an OTP to a user's phone.
 * In a real app, this would call your backend to trigger an SMS service.
 */
export const sendOtp = (phone: string): Promise<void> => {
  return new Promise((resolve) => {
    // Simulate network delay
    setTimeout(() => {
      // In this mock, we'll store a "sent" OTP in session storage to verify against.
      // A real OTP would be a random 6-digit number.
      const mockOtp = '123456';
      console.log(`(Mock) OTP sent to ${phone}: ${mockOtp}`);
      sessionStorage.setItem(`otp_for_${phone}`, mockOtp);
      resolve();
    }, 1000);
  });
};

/**
 * Simulates verifying an OTP, logging the user in, and creating an account if it doesn't exist.
 */
export const verifyOtp = (phone: string, code: string): Promise<{ identifier: string } | null> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const sentOtp = sessionStorage.getItem(`otp_for_${phone}`);
      if (sentOtp && sentOtp === code) {
        sessionStorage.removeItem(`otp_for_${phone}`);

        const users = getMockUsers();
        // Create user if they don't exist
        if (!users[phone]) {
          users[phone] = { activated: false };
          saveMockUsers(users);
        }

        const user = { identifier: phone };
        // Store session
        localStorage.setItem(USER_SESSION_KEY, JSON.stringify(user));
        resolve(user);
      } else {
        reject(new Error('验证码错误，请重试。'));
      }
    }, 1000);
  });
};

/**
 * Checks if a user has activated their account.
 */
export const isUserActivated = (identifier: string): boolean => {
    const users = getMockUsers();
    return users[identifier]?.activated || false;
};

/**
 * Simulates verifying a one-time activation code from Weidian.
 */
export const verifyActivationCode = (identifier: string, code: string): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const allCodes: { code: string; used: boolean }[] = JSON.parse(localStorage.getItem(DB_CODES_KEY) || '[]');
      const foundCode = allCodes.find(c => c.code === code);

      if (foundCode && !foundCode.used) {
        // Mark code as used
        foundCode.used = true;
        localStorage.setItem(DB_CODES_KEY, JSON.stringify(allCodes));

        // Activate user
        const users = getMockUsers();
        if(users[identifier]) {
            users[identifier].activated = true;
            saveMockUsers(users);
            resolve(true);
        } else {
            reject(new Error('未找到用户，请重新登录。'));
        }
      } else {
        // Code is invalid or already used
        resolve(false);
      }
    }, 1500);
  });
};


/**
 * Retrieves the current user from the session.
 */
export const getCurrentUser = (): { identifier: string } | null => {
  const session = localStorage.getItem(USER_SESSION_KEY);
  return session ? JSON.parse(session) : null;
};

/**
 * Logs the user out by clearing the session.
 */
export const logout = () => {
  localStorage.removeItem(USER_SESSION_KEY);
};
