import { Link as ChakraLink, LinkProps } from '@chakra-ui/react';
import NextLink from 'next/link';
import { ReactNode } from 'react';
import { UrlObject } from 'url';

interface Props extends LinkProps {
  href: string | UrlObject;
  children: ReactNode;
}

export default function Link({ href, children, ...rest }: Props) {
  return (
    <NextLink href={href} passHref>
      <ChakraLink {...rest}>{children}</ChakraLink>
    </NextLink>
  );
}
