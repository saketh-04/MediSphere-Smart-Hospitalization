import React, { useState, useEffect, useRef } from 'react';

const NotificationBox = ({ reminders = [], setReminders }) => {
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [dismissedNotifications, setDismissedNotifications] = useState([]);
  const intervalRef = useRef(null);

  // Debug rendering
  useEffect(() => {
    console.log('NotificationBox component rendered');
    return () => {
      console.log('NotificationBox component unmounted');
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  // Initialize notifications only once on component mount
  useEffect(() => {
    if (notifications.length === 0) {
      const sampleNotifications = [];
      setNotifications(sampleNotifications);
    }
  }, []);

  // Update reminders dynamically based on current time
  useEffect(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    intervalRef.current = setInterval(() => {
      const now = new Date();
      console.log('Checking reminders at:', now.toISOString());
      const activeReminders = reminders.filter(r => !r.dismissed && new Date(r.time) <= now);
      
      if (activeReminders.length > 0) {
        setNotifications(prev => [
          ...prev,
          ...activeReminders.map(reminder => ({
            id: `notif-${reminder.id}-${Date.now()}`,
            message: reminder.message,
            time: reminder.time,
            type: reminder.type
          }))
        ]);
        setReminders(prev => prev.map(r => 
          activeReminders.includes(r) ? { ...r, dismissed: true } : r
        ));
        console.log('Active reminders moved to notifications:', activeReminders);
      }
    }, 10000);

    return () => clearInterval(intervalRef.current);
  }, [reminders, setReminders]);

  const toggleNotificationBox = () => {
    setIsOpen(prev => !prev);
  };

  const getNotificationsByType = (type) =>
    notifications?.filter((notif) => 
      notif.type === type && !dismissedNotifications.includes(notif.id)
    ) || [];

  const getRemindersByType = (type) =>
    reminders.filter((reminder) => !reminder.dismissed && reminder.type === type);

  const handleDismissReminder = (id) => {
    setReminders(reminders.map(reminder => 
      reminder.id === id ? { ...reminder, dismissed: true } : reminder
    ));
  };

  const handleDismissNotification = (id) => {
    setDismissedNotifications(prev => [...prev, id]);
  };

  // Calculate total count - Only count active (non-dismissed) reminders and notifications
  const activeReminders = reminders.filter((r) => !r.dismissed);
  const activeNotifications = notifications.filter((n) => !dismissedNotifications.includes(n.id));
  const totalCount = activeNotifications.length + activeReminders.length;

  // Format reminder time for display
  const formatTime = (timeString) => {
    if (!timeString) return '';
    try {
      const date = new Date(timeString);
      return date.toLocaleString([], { 
        month: 'short', 
        day: 'numeric', 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    } catch (e) {
      console.error('Error formatting time:', e);
      return timeString;
    }
  };

  return (
    <div className="fixed top-20 right-6 z-[1] bg-[#000]" onClick={toggleNotificationBox}>
      <button
        className="relative bg-blue-500 text-white rounded-full w-0 h-0 flex items-center justify-center hover:bg-blue-600 transition-colors shadow-lg cursor-pointer">
      </button>
      {totalCount > 0 && (
        <span className="absolute top-0 right-0 bg-blue-500 z-[999] text-white text-xs rounded-full w-12 h-12 flex items-center justify-center">
          <span className='absolute top-[-1px] flex items-center justify-center right-[0px] text-[#fff] text-[12px] font-semibold w-[20px] h-[20px] rounded-full bg-red-700'>{totalCount}</span>
          <span><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M160-200v-80h80v-280q0-83 50-147.5T420-792v-28q0-25 17.5-42.5T480-880q25 0 42.5 17.5T540-820v28q80 20 130 84.5T720-560v280h80v80H160Zm320-300Zm0 420q-33 0-56.5-23.5T400-160h160q0 33-23.5 56.5T480-80ZM320-280h320v-280q0-66-47-113t-113-47q-66 0-113 47t-47 113v280Z"/></svg></span>
        </span>
      )}

      {isOpen && (
        <div className="absolute top-14 right-0 w-96 bg-white border border-gray-200 shadow-xl rounded-lg z-10 max-h-[80vh] overflow-y-auto">
          <div className="sticky top-0 bg-white p-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold">Notifications ({totalCount})</h3>
          </div>

          <div className="p-4 space-y-4">
            {/* General Reminders */}
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-gray-700">General Reminders</h4>
              {getRemindersByType('general').length > 0 || getNotificationsByType('general').length > 0 ? (
                <>
                  {getRemindersByType('general').map((reminder) => (
                    <div key={reminder.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                      <div>
                        <p className="text-sm text-gray-800">{reminder.message}</p>
                        <p className="text-xs text-gray-500">{formatTime(reminder.time)}</p>
                      </div>
                      <button
                        onClick={() => handleDismissReminder(reminder.id)}
                        className="text-xs text-gray-600 hover:text-gray-800"
                        aria-label="Dismiss reminder"
                      >
                        Dismiss
                      </button>
                    </div>
                  ))}
                  {getNotificationsByType('general').map((notification) => (
                    <div key={notification.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                      <div>
                        <p className="text-sm text-gray-800">{notification.message}</p>
                        <p className="text-xs text-gray-500">{formatTime(notification.time)}</p>
                      </div>
                      <button
                        onClick={() => handleDismissNotification(notification.id)}
                        className="text-xs text-gray-600 hover:text-gray-800"
                        aria-label="Dismiss notification"
                      >
                        Dismiss
                      </button>
                    </div>
                  ))}
                </>
              ) : (
                <p className="text-sm text-gray-500 italic">No general reminders</p>
              )}
            </div>

            {/* Medication Reminders */}
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-gray-700">Medication Reminders</h4>
              {getRemindersByType('medication').length > 0 || getNotificationsByType('medication').length > 0 ? (
                <>
                  {getRemindersByType('medication').map((reminder) => (
                    <div key={reminder.id} className="flex items-center justify-between p-2 bg-blue-50 rounded-lg">
                      <div>
                        <p className="text-sm text-blue-800">{reminder.message}</p>
                        <p className="text-xs text-blue-500">{formatTime(reminder.time)}</p>
                      </div>
                      <button
                        onClick={() => handleDismissReminder(reminder.id)}
                        className="text-xs text-blue-600 hover:text-blue-800"
                        aria-label="Dismiss reminder"
                      >
                        Dismiss
                      </button>
                    </div>
                  ))}
                  {getNotificationsByType('medication').map((notification) => (
                    <div key={notification.id} className="flex items-center justify-between p-2 bg-blue-50 rounded-lg">
                      <div>
                        <p className="text-sm text-blue-800">{notification.message}</p>
                        <p className="text-xs text-blue-500">{formatTime(notification.time)}</p>
                      </div>
                      <button
                        onClick={() => handleDismissNotification(notification.id)}
                        className="text-xs text-blue-600 hover:text-blue-800"
                        aria-label="Dismiss notification"
                      >
                        Dismiss
                      </button>
                    </div>
                  ))}
                </>
              ) : (
                <p className="text-sm text-gray-500 italic">No medication reminders</p>
              )}
            </div>

            {/* Appointments */}
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-gray-700">Appointments</h4>
              {getRemindersByType('appointment').length > 0 || getNotificationsByType('appointment').length > 0 ? (
                <>
                  {getRemindersByType('appointment').map((reminder) => (
                    <div key={reminder.id} className="flex items-center justify-between p-2 bg-purple-50 rounded-lg">
                      <div>
                        <p className="text-sm text-purple-800">{reminder.message}</p>
                        <p className="text-xs text-purple-500">{formatTime(reminder.time)}</p>
                      </div>
                      <button
                        onClick={() => handleDismissReminder(reminder.id)}
                        className="text-xs text-purple-600 hover:text-purple-800"
                        aria-label="Dismiss reminder"
                      >
                        Dismiss
                      </button>
                    </div>
                  ))}
                  {getNotificationsByType('appointment').map((notification) => (
                    <div key={notification.id} className="flex items-center justify-between p-2 bg-purple-50 rounded-lg">
                      <div>
                        <p className="text-sm text-purple-800">{notification.message}</p>
                        <p className="text-xs text-purple-500">{formatTime(notification.time)}</p>
                      </div>
                      <button
                        onClick={() => handleDismissNotification(notification.id)}
                        className="text-xs text-purple-600 hover:text-purple-800"
                        aria-label="Dismiss notification"
                      >
                        Dismiss
                      </button>
                    </div>
                  ))}
                </>
              ) : (
                <p className="text-sm text-gray-500 italic">No appointments</p>
              )}
            </div>

            {/* Wellness Reminders */}
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-gray-700">Wellness Reminders</h4>
              {getRemindersByType('wellness').length > 0 || getNotificationsByType('wellness').length > 0 ? (
                <>
                  {getRemindersByType('wellness').map((reminder) => (
                    <div key={reminder.id} className="flex items-center justify-between p-2 bg-green-50 rounded-lg">
                      <div>
                        <p className="text-sm text-green-800">{reminder.message}</p>
                        <p className="text-xs text-green-500">{formatTime(reminder.time)}</p>
                      </div>
                      <button
                        onClick={() => handleDismissReminder(reminder.id)}
                        className="text-xs text-green-600 hover:text-green-800"
                        aria-label="Dismiss reminder"
                      >
                        Dismiss
                      </button>
                    </div>
                  ))}
                  {getNotificationsByType('wellness').map((notification) => (
                    <div key={notification.id} className="flex items-center justify-between p-2 bg-green-50 rounded-lg">
                      <div>
                        <p className="text-sm text-green-800">{notification.message}</p>
                        <p className="text-xs text-green-500">{formatTime(notification.time)}</p>
                      </div>
                      <button
                        onClick={() => handleDismissNotification(notification.id)}
                        className="text-xs text-green-600 hover:text-green-800"
                        aria-label="Dismiss notification"
                      >
                        Dismiss
                      </button>
                    </div>
                  ))}
                </>
              ) : (
                <p className="text-sm text-gray-500 italic">No wellness reminders</p>
              )}
            </div>

            {/* Triage Notifications */}
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-gray-700">Urgent Notifications</h4>
              {getRemindersByType('triage').length > 0 || getNotificationsByType('triage').length > 0 ? (
                <>
                  {getRemindersByType('triage').map((reminder) => (
                    <div key={reminder.id} className="flex items-center justify-between p-2 bg-red-50 rounded-lg">
                      <div>
                        <p className="text-sm text-red-800">{reminder.message}</p>
                        <p className="text-xs text-red-500">{formatTime(reminder.time)}</p>
                      </div>
                      <button
                        onClick={() => handleDismissReminder(reminder.id)}
                        className="text-xs text-red-600 hover:text-red-800"
                        aria-label="Dismiss reminder"
                      >
                        Dismiss
                      </button>
                    </div>
                  ))}
                  {getNotificationsByType('triage').map((notification) => (
                    <div key={notification.id} className="flex items-center justify-between p-2 bg-red-50 rounded-lg">
                      <div>
                        <p className="text-sm text-red-800">{notification.message}</p>
                        <p className="text-xs text-red-500">{formatTime(notification.time)}</p>
                      </div>
                      <button
                        onClick={() => handleDismissNotification(notification.id)}
                        className="text-xs text-red-600 hover:text-red-800"
                        aria-label="Dismiss notification"
                      >
                        Dismiss
                      </button>
                    </div>
                  ))}
                </>
              ) : (
                <p className="text-sm text-gray-500 italic">No urgent notifications</p>
              )}
            </div>
          </div>

          
        </div>
      )}
    </div>
  );
};

export default NotificationBox;