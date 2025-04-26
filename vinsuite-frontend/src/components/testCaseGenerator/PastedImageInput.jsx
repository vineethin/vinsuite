import React, { useEffect } from 'react';

const PastedImageInput = ({ onImagePaste }) => {
  useEffect(() => {
    const handlePaste = (event) => {
      const items = event.clipboardData?.items;
      if (!items) return;

      for (let item of items) {
        if (item.type.startsWith('image')) {
          const file = item.getAsFile();
          const reader = new FileReader();

          reader.onload = (e) => {
            if (typeof onImagePaste === 'function') {
              // console.log("📋 Pasted image detected");
              onImagePaste(e.target.result);
            } else {
              console.error("❌ onImagePaste is not a function");
            }
          };

          reader.readAsDataURL(file);
          break;
        }
      }
    };

    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, [onImagePaste]);

  return (
    <div className="mt-4 text-sm text-gray-600">
      📋 Paste an image here using <strong>Ctrl + V</strong>
    </div>
  );
};

export default PastedImageInput;
