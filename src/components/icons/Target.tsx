function SvgTarget(props) {
  return (
    <svg
      width="1em"
      height="1em"
      viewBox="0 0 32 32"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      display="block"
      aria-hidden={true}
      focusable={false}
      role="presentation"
      {...props}
    >
      <circle opacity={0.13} cx={16} cy={16} r={16} fill="#05A8FA" />
      <path
        opacity={0.4}
        fillRule="evenodd"
        clipRule="evenodd"
        d="M16 26.24c-5.656 0-10.24-4.585-10.24-10.24S10.344 5.76 16 5.76c5.655 0 10.24 4.585 10.24 10.24S21.655 26.24 16 26.24zm0-3.52a6.72 6.72 0 100-13.44 6.72 6.72 0 000 13.44zM12.16 16a3.84 3.84 0 107.68 0 3.84 3.84 0 00-7.68 0z"
        fill="#05A8FA"
      />
      <path
        d="M19.933 13.374L17.1 16.207a.96.96 0 01-1.358-1.358l2.956-2.955-.227-1.09c-.072-.347.073-.832.32-1.079l3.845-3.845c.249-.249.51-.169.581.178l.493 2.368 2.369.493c.347.072.424.335.177.581l-3.845 3.846c-.249.248-.733.392-1.079.32l-1.4-.292z"
        fill="#05A8FA"
      />
    </svg>
  );
}

export default SvgTarget;
