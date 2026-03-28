/**
 * Simple Markdown-to-HTML renderer for the AEGIS Red Team Lab.
 * Supports: headers, bold, italic, code blocks, inline code,
 * blockquotes, lists, horizontal rules, paragraphs.
 */
export function renderMarkdown(text) {
  if (!text) return '';
  var html = text
    // Escape HTML
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    // Code blocks (``` ... ```)
    .replace(/```(\w*)\n([\s\S]*?)```/g, function(_, lang, code) {
      return '<pre class="bg-neutral-900 border border-neutral-700 rounded p-2 my-2 overflow-x-auto text-[10px] leading-relaxed"><code class="text-green-400">' + code.trim() + '</code></pre>';
    })
    // Inline code
    .replace(/`([^`]+)`/g, '<code class="bg-neutral-800 text-cyan-400 px-1 py-0.5 rounded text-[10px]">$1</code>')
    // Headers
    .replace(/^### (.+)$/gm, '<h3 class="text-sm font-bold text-red-400 mt-3 mb-1">$1</h3>')
    .replace(/^## (.+)$/gm, '<h2 class="text-base font-bold text-red-300 mt-4 mb-1.5 border-b border-neutral-800 pb-1">$1</h2>')
    .replace(/^# (.+)$/gm, '<h1 class="text-lg font-bold text-white mt-4 mb-2">$1</h1>')
    // Bold + Italic
    .replace(/\*\*\*(.+?)\*\*\*/g, '<strong class="text-white"><em>$1</em></strong>')
    .replace(/\*\*(.+?)\*\*/g, '<strong class="text-neutral-200">$1</strong>')
    .replace(/\*(.+?)\*/g, '<em class="text-neutral-300">$1</em>')
    // Blockquotes
    .replace(/^&gt; (.+)$/gm, '<blockquote class="border-l-2 border-yellow-500/60 pl-3 py-0.5 my-1 text-yellow-400/80 italic">$1</blockquote>')
    // Unordered lists
    .replace(/^- (.+)$/gm, '<li class="ml-4 list-disc text-neutral-400 leading-relaxed">$1</li>')
    // Ordered lists
    .replace(/^(\d+)\. (.+)$/gm, '<li class="ml-4 list-decimal text-neutral-400 leading-relaxed">$2</li>')
    // Horizontal rule
    .replace(/^---$/gm, '<hr class="border-neutral-700 my-3" />')
    // Line breaks → paragraphs
    .replace(/\n\n/g, '</p><p class="text-neutral-400 leading-relaxed my-1.5">')
    .replace(/\n/g, '<br/>');
  return '<p class="text-neutral-400 leading-relaxed my-1.5">' + html + '</p>';
}
