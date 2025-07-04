import React, { useState, useEffect } from 'react';

const Clock = () => {
  const [currentDate, setCurrentDate] = useState('');
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();

      // Format tanggal: 03 Juli 2025
      const options = { day: '2-digit', month: 'long', year: 'numeric' };
      const formattedDate = now.toLocaleDateString('id-ID', options);

      const formattedTime = now.toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      });

      setCurrentDate(formattedDate);
      setCurrentTime(formattedTime);
    };

    updateDateTime(); // Panggil sekali saat awal
    const interval = setInterval(updateDateTime, 1000); // Update setiap detik

    return () => clearInterval(interval); // Bersihkan interval saat komponen dibongkar
  }, []);

  return (
    <>
      <p>{currentDate}</p>
      <h5>{currentTime}</h5>
    </>
  );
};

export default Clock;