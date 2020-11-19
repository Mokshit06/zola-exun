import { Box, BoxProps } from '@chakra-ui/react';
import React from 'react';

export function Table(props: BoxProps) {
  return (
    <Box boxShadow='md' rounded='md' overflowX='auto'>
      <Box as='table' width='full' {...props} />
    </Box>
  );
}

export function TableHead(props: BoxProps) {
  return <Box as='thead' borderBottomWidth={1} {...props} />;
}

export function TableRow(props: BoxProps) {
  return <Box as='tr' {...props} />;
}

export function TableHeader(props: BoxProps) {
  return (
    <Box
      as='th'
      px='6'
      py='4'
      borderBottomWidth={1}
      textAlign='left'
      fontSize='sm'
      color='gray.500'
      textTransform='uppercase'
      letterSpacing='wider'
      lineHeight='1rem'
      fontWeight='medium'
      {...props}
    />
  );
}

export function TableBody(props: BoxProps) {
  return <Box as='tbody' {...props} />;
}

export function TableCell(props: BoxProps) {
  return (
    <Box
      as='td'
      px='6'
      py='4'
      lineHeight='1.25rem'
      whiteSpace='nowrap'
      {...props}
    />
  );
}
