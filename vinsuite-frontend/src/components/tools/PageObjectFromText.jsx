import React, { useState } from 'react';

const PageObjectFromText = () => {
  const [htmlInput, setHtmlInput] = useState('');
  const [xpaths, setXpaths] = useState([]);
  const [loading, setLoading] = useState(false);

  const parseHtmlAndGenerateXpaths = () => {
    try {
      setLoading(true);
      const parser = new DOMParser();
      const doc = parser.parseFromString(htmlInput, 'text/html');
      const elements = doc.querySelectorAll('input, button, select, textarea, a');

      const xpathResults = [];

      elements.forEach((el, index) => {
        const label = el.getAttribute('aria-label') ||
                      el.getAttribute('placeholder') ||
                      el.getAttribute('title') ||
                      el.textContent?.trim();

        if (!label) return;

        const xpath = generateRelativeXPath(el);
        const name = label.replace(/\s+/g, '_').replace(/[^\w]/g, '').toLowerCase();
        const javaLine = `@FindBy(xpath = "${xpath}")\nWebElement ${name};`;

        xpathResults.push({
          tag: el.tagName.toLowerCase(),
          label,
          xpath,
          javaLine
        });
      });

      setXpaths(xpathResults);
    } catch (err) {
      console.error('Parsing error:', err);
    } finally {
      setLoading(false);
    }
  };

  const generateRelativeXPath = (element) => {
    if (!element || !element.tagName) return '';

    let labelText = element.getAttribute('aria-label') ||
                    element.getAttribute('placeholder') ||
                    element.getAttribute('title') ||
                    element.textContent?.trim();

    if (!labelText) return '';

    const lowerText = labelText.toLowerCase();
    return `//${element.tagName.toLowerCase()}[contains(normalize-space(.), '${lowerText}')]`;
  };

  return (
    <div>
      <textarea
        className="w-full border p-2 mb-4"
        rows={10}
        placeholder="Paste HTML here..."
        value={htmlInput}
        onChange={(e) => setHtmlInput(e.target.value)}
      />

      <button
        onClick={parseHtmlAndGenerateXpaths}
        className="bg-blue-600 text-white px-4 py-2 rounded"
        disabled={loading}
      >
        {loading ? 'Parsing...' : 'Parse HTML'}
      </button>

      {xpaths.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2">Generated Page Object Snippets</h3>
          <table className="w-full border text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="border px-2 py-1">Tag</th>
                <th className="border px-2 py-1">Label</th>
                <th className="border px-2 py-1">XPath</th>
                <th className="border px-2 py-1">Java Snippet</th>
              </tr>
            </thead>
            <tbody>
              {xpaths.map((item, idx) => (
                <tr key={idx}>
                  <td className="border px-2 py-1">{item.tag}</td>
                  <td className="border px-2 py-1">{item.label}</td>
                  <td className="border px-2 py-1 text-xs">{item.xpath}</td>
                  <td className="border px-2 py-1 text-xs whitespace-pre">{item.javaLine}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default PageObjectFromText;
