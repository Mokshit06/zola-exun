const NoSsr: React.FC = ({ children }) => {
  return typeof window !== 'undefined' ? <>{children}</> : <div />;
};

export default NoSsr;
