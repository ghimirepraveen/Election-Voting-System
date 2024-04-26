const Footer = () => {
  const year = new Date().getFullYear();
  return (
    <footer className="footer text-center flex justify-center items-center bg-blue-400 h-24">
      <p>© {year}. All Rights Reserved.</p>
    </footer>
  );
};
export default Footer;
