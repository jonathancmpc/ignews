import { useRouter } from 'next/router';
import Link, { LinkProps } from 'next/link';
import { ReactElement, cloneElement } from 'react';

interface ActiveLinkProps extends LinkProps {
  children: ReactElement;
  activeClassName: string;
}

export function ActiveLink({children, activeClassName, ...rest}: ActiveLinkProps) {
  const { asPath } = useRouter(); //Rota que está sendo acessada no momento

  const className = asPath === rest.href
    ? activeClassName
    : '';
  
  return (
    <Link {...rest}>
      {/* Clonamos o children e passamos pra ele a propriedade que queremos passar, nesse caso, a classe */}
      {cloneElement(children, {
        className
      })}
    </Link>
  )
}