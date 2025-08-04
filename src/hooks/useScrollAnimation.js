import { useEffect, useRef, useState } from 'react';

// CUSTOM HOOK - useScrollAnimation
// Hook ini menggunakan Intersection Observer API untuk mendeteksi kapan element masuk viewport
// Dan trigger animasi dengan mengubah state isVisible menjadi true
export const useScrollAnimation = (threshold = 0.1, rootMargin = '0px 0px -50px 0px') => {
  const [isVisible, setIsVisible] = useState(false); // State untuk visibility element
  const ref = useRef(null); // Ref untuk element yang akan di-observe

  useEffect(() => {
    // Buat Intersection Observer untuk detect element visibility
    const observer = new IntersectionObserver(
      ([entry]) => {
        // Callback ketika element masuk/keluar viewport
        if (entry.isIntersecting) {
          setIsVisible(true); // Set visible ke true saat element terlihat
          // Disconnect observer setelah trigger pertama untuk hemat memory
          observer.disconnect();
        }
      },
      { 
        threshold, // Berapa persen element harus visible (default 10%)
        rootMargin // Margin dari viewport untuk trigger early/late (default -50px dari bottom)
      }
    );

    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef); // Mulai observe element
    }

    // Cleanup function saat component unmount
    return () => {
      observer.disconnect();
    };
  }, [threshold, rootMargin]); // Dependencies untuk re-run effect

  return [ref, isVisible]; // Return ref untuk attach ke element dan state visibility
};