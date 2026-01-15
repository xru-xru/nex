const SvgCopyToClipboard = (props) => (
  <svg
    width="1em"
    height="1em"
    viewBox="0 0 16 16"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
    display="block"
    aria-hidden={true}
    focusable={false}
    role="presentation"
    {...props}
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M14.5 0h-10A1.5 1.5 0 0 0 3 1.5V3H1.5A1.5 1.5 0 0 0 0 4.5v10A1.5 1.5 0 0 0 1.5 16h10a1.5 1.5 0 0 0 1.5-1.5V13h1.5a1.5 1.5 0 0 0 1.5-1.5v-10A1.5 1.5 0 0 0 14.5 0Zm-3.188 14.5H1.688a.187.187 0 0 1-.188-.188V4.688c0-.104.084-.188.188-.188H3v7A1.5 1.5 0 0 0 4.5 13h7v1.313a.187.187 0 0 1-.188.187Zm-6.624-3h9.625a.187.187 0 0 0 .187-.188V1.688a.187.187 0 0 0-.188-.188H4.688a.188.188 0 0 0-.188.188v9.624c0 .104.084.188.188.188Z"
      fill="#A0A2AD"
    />
  </svg>
);
export default SvgCopyToClipboard;
