import React from 'react';
import { PronunciationCoach } from './components/PronunciationCoach';

// Note: We are temporarily bypassing the login/verification flow to allow for content review.
// The original authentication logic can be restored later to re-enable the full user flow.

function App() {
  const handleLogout = () => {
    // In this preview mode, the logout function is a placeholder.
    // It will be fully functional once the registration flow is re-enabled.
    alert("“退出登录”功能将在注册流程恢复后启用。");
  };

  return <PronunciationCoach onLogout={handleLogout} />;
}

export default App;