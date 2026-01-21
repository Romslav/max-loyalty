import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

interface NotificationPreferences {
  emailNotifications: boolean;
  smsNotifications: boolean;
  frequency: 'INSTANT' | 'DAILY' | 'WEEKLY';
  email: string;
  phoneNumber: string;
}

const NotificationSettingsPage: React.FC = () => {
  const [preferences, setPreferences] = useState<NotificationPreferences>({
    emailNotifications: true,
    smsNotifications: false,
    frequency: 'INSTANT',
    email: '',
    phoneNumber: '',
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [testEmail, setTestEmail] = useState('');

  useEffect(() => {
    fetchPreferences();
  }, []);

  const fetchPreferences = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/notifications/preferences');
      if (response.ok) {
        const data = await response.json();
        setPreferences(data);
        setTestEmail(data.email);
      }
    } catch (error) {
      console.error('Error fetching preferences:', error);
      toast.error('Failed to load notification preferences');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePreferenceChange = (key: keyof NotificationPreferences, value: any) => {
    setPreferences((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSavePreferences = async () => {
    try {
      setIsSaving(true);
      const response = await fetch('/api/notifications/preferences', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(preferences),
      });

      if (response.ok) {
        toast.success('Notification preferences saved!');
      } else {
        throw new Error('Failed to save preferences');
      }
    } catch (error) {
      console.error('Error saving preferences:', error);
      toast.error('Failed to save preferences');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSendTestEmail = async () => {
    try {
      const response = await fetch('/api/notifications/test-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: testEmail }),
      });

      if (response.ok) {
        toast.success(`Test email sent to ${testEmail}!`);
      } else {
        throw new Error('Failed to send test email');
      }
    } catch (error) {
      console.error('Error sending test email:', error);
      toast.error('Failed to send test email');
    }
  };

  if (isLoading) {
    return (
      <div className="settings-page">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="settings-page">
      <div className="settings-header">
        <h1>📧 Notification Settings</h1>
        <p className="page-subtitle">Manage how you receive updates</p>
      </div>

      <div className="settings-container">
        {/* Email Notifications Section */}
        <div className="settings-section">
          <div className="section-header">
            <h2>📧 Email Notifications</h2>
            <p>Receive updates via email about your loyalty account</p>
          </div>

          <div className="settings-group">
            <div className="toggle-item">
              <div className="toggle-info">
                <h3>Enable Email Notifications</h3>
                <p>Receive email updates about tier upgrades, points, and rewards</p>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={preferences.emailNotifications}
                  onChange={(e) =>
                    handlePreferenceChange('emailNotifications', e.target.checked)
                  }
                />
                <span className="toggle-slider"></span>
              </label>
            </div>

            {preferences.emailNotifications && (
              <>
                <div className="form-group">
                  <label htmlFor="email" className="form-label">
                    Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    className="form-control"
                    value={preferences.email}
                    onChange={(e) => handlePreferenceChange('email', e.target.value)}
                    placeholder="your@email.com"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="frequency" className="form-label">
                    Notification Frequency
                  </label>
                  <select
                    id="frequency"
                    className="form-control"
                    value={preferences.frequency}
                    onChange={(e) =>
                      handlePreferenceChange(
                        'frequency',
                        e.target.value as 'INSTANT' | 'DAILY' | 'WEEKLY',
                      )
                    }
                  >
                    <option value="INSTANT">Instant - Get notified immediately</option>
                    <option value="DAILY">Daily - Once per day summary</option>
                    <option value="WEEKLY">Weekly - Once per week digest</option>
                  </select>
                </div>

                <div className="notification-types">
                  <h4>Email Types</h4>
                  <div className="checkbox-list">
                    <label className="checkbox-item">
                      <input type="checkbox" checked={true} disabled />
                      <span>Tier upgrades</span>
                    </label>
                    <label className="checkbox-item">
                      <input type="checkbox" checked={true} disabled />
                      <span>Points earned</span>
                    </label>
                    <label className="checkbox-item">
                      <input type="checkbox" checked={true} disabled />
                      <span>New rewards available</span>
                    </label>
                    <label className="checkbox-item">
                      <input type="checkbox" checked={true} disabled />
                      <span>Monthly summary</span>
                    </label>
                    <label className="checkbox-item">
                      <input type="checkbox" checked={true} disabled />
                      <span>Birthday bonus</span>
                    </label>
                  </div>
                </div>

                <button
                  className="btn btn--secondary"
                  onClick={handleSendTestEmail}
                  style={{ marginTop: '12px' }}
                >
                  📧 Send Test Email
                </button>
              </>
            )}
          </div>
        </div>

        {/* SMS Notifications Section */}
        <div className="settings-section">
          <div className="section-header">
            <h2>📱 SMS Notifications</h2>
            <p>Receive quick updates via text message</p>
          </div>

          <div className="settings-group">
            <div className="toggle-item">
              <div className="toggle-info">
                <h3>Enable SMS Notifications</h3>
                <p>Get important updates via SMS (message rates may apply)</p>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={preferences.smsNotifications}
                  onChange={(e) =>
                    handlePreferenceChange('smsNotifications', e.target.checked)
                  }
                />
                <span className="toggle-slider"></span>
              </label>
            </div>

            {preferences.smsNotifications && (
              <>
                <div className="form-group">
                  <label htmlFor="phone" className="form-label">
                    Phone Number
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    className="form-control"
                    value={preferences.phoneNumber}
                    onChange={(e) =>
                      handlePreferenceChange('phoneNumber', e.target.value)
                    }
                    placeholder="+49 123 456789"
                  />
                </div>

                <div className="notification-types">
                  <h4>SMS Types</h4>
                  <div className="checkbox-list">
                    <label className="checkbox-item">
                      <input type="checkbox" checked={true} disabled />
                      <span>Tier upgrades</span>
                    </label>
                    <label className="checkbox-item">
                      <input type="checkbox" checked={true} disabled />
                      <span>Important alerts</span>
                    </label>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Notification History Section */}
        <div className="settings-section">
          <div className="section-header">
            <h2>📄 Notification History</h2>
            <p>View your recent notifications</p>
          </div>

          <div className="notification-history">
            <div className="history-item">
              <div className="history-icon">⭐</div>
              <div className="history-content">
                <p className="history-title">Tier Upgrade - Gold</p>
                <p className="history-time">2 days ago</p>
              </div>
            </div>
            <div className="history-item">
              <div className="history-icon">💰</div>
              <div className="history-content">
                <p className="history-title">Points Earned - 150 pts</p>
                <p className="history-time">1 week ago</p>
              </div>
            </div>
            <div className="history-item">
              <div className="history-icon">🎁</div>
              <div className="history-content">
                <p className="history-title">New Reward Available</p>
                <p className="history-time">2 weeks ago</p>
              </div>
            </div>
          </div>
        </div>

        {/* Privacy Section */}
        <div className="settings-section privacy-section">
          <div className="section-header">
            <h2>🔒 Privacy & Data</h2>
            <p>Manage your data preferences</p>
          </div>

          <div className="settings-group">
            <div className="privacy-item">
              <h4>Unsubscribe from all emails</h4>
              <p>You can unsubscribe from our emails at any time using the link at the bottom of each email.</p>
              <button className="btn btn--outline">View Unsubscribe Options</button>
            </div>
            <div className="privacy-item">
              <h4>Download your data</h4>
              <p>Request a copy of all your personal data in a portable format.</p>
              <button className="btn btn--outline">Download My Data</button>
            </div>
            <div className="privacy-item">
              <h4>Delete my account</h4>
              <p>Permanently delete your loyalty account and all associated data.</p>
              <button className="btn btn--outline" style={{ color: 'var(--color-error)' }}>
                Delete Account
              </button>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="settings-actions">
          <button className="btn btn--secondary" onClick={fetchPreferences}>
            Reset
          </button>
          <button
            className="btn btn--primary"
            onClick={handleSavePreferences}
            disabled={isSaving}
          >
            {isSaving ? 'Saving...' : '💾 Save Preferences'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotificationSettingsPage;
