import MarkdownIt from 'markdown-it';

/** Single shared MarkdownIt instance to avoid multiple instances and repeated config. */
export const markdownRenderer = new MarkdownIt();
