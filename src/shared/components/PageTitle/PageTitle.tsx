import { useEffect } from 'react';

interface PageTitleProps {
  title: string;
  children: React.ReactNode;
}

const PageTitle = ({ title, children }: PageTitleProps) => {
  useEffect(() => {
    document.title = title;
  }, [title]);

  return <>{children}</>;
};

export default PageTitle;