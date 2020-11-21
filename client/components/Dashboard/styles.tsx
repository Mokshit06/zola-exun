import {
  Badge,
  Box,
  Button,
  ButtonProps,
  Flex,
  Grid,
  Switch,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import NoSsr from 'components/NoSsr';
import useGlobal from 'contexts/GlobalProvider';
import { Card as CardType } from 'interfaces';

export const CardsContainer: React.FC<{ title: string }> = ({
  title,
  children,
}) => {
  const headColor = useColorModeValue('#2c2c2c', 'gray.100');

  return (
    <Box m={{ sm: '2.5rem 3.5rem', md: '2.2rem', base: '1.7rem' }}>
      <Text
        as='h2'
        fontSize='1.8rem'
        fontWeight={500}
        mb='1rem'
        color={headColor}
      >
        {title}
      </Text>
      {children}
    </Box>
  );
};

export const CardGrid: React.FC = ({ children }) => {
  return (
    <Grid
      templateColumns={{
        md: 'repeat(auto-fit, minmax(250px, 1fr))',
        base: 'repeat(auto-fit, minmax(210px, 1fr))',
      }}
      gap='1.2rem'
    >
      {children}
    </Grid>
  );
};

interface CardProps {
  card: CardType;
}

export function Card({ card }: CardProps) {
  const { appliances, dispatch } = useGlobal();
  const cardColor = useColorModeValue('#EDF2F7', 'rgba(255, 255, 255, 0.08)');
  const isOn = appliances[card.slug];

  const handleChange = (event: any) => {
    dispatch({
      type: isOn === false ? 'TURN_ON' : 'TURN_OFF',
      payload: card.slug,
    });
  };

  return (
    <Flex
      bgColor={cardColor}
      p='1.2rem'
      flexDir='column'
      justifyContent='space-evenly'
      borderRadius='25px'
      minH={{ base: '20vh', sm: null }}
    >
      <Flex width='full' justifyContent='space-between' alignItems='center'>
        <card.icon fontSize='2rem' />
        {card.slug && (
          <NoSsr>
            <Switch
              size='lg'
              defaultIsChecked={isOn}
              isChecked={isOn}
              onChange={e => handleChange(e)}
            />
          </NoSsr>
        )}
      </Flex>
      <Box>
        {card.slug &&
          (isOn ? (
            <Badge colorScheme='green'>OPEN</Badge>
          ) : (
            <Badge colorScheme='red'>CLOSED</Badge>
          ))}

        <Text
          as='h3'
          mt={1}
          fontSize={{ base: '1.24rem', sm: '1.4rem' }}
          letterSpacing='1px'
          fontWeight={500}
        >
          {card.title}
        </Text>
      </Box>
    </Flex>
  );
}

export function CardButton({
  card,
  title,
  ...props
}: Omit<CardProps, 'slug'> & ButtonProps) {
  const cardColor = useColorModeValue('#EDF2F7', 'rgba(255, 255, 255, 0.08)');

  console.log(card.icon);
  return (
    <Button
      bgColor={cardColor}
      p='1.2rem'
      flexDir='column'
      justifyContent='space-evenly'
      borderRadius='25px'
      minH={{ base: '20vh', sm: null }}
      {...props}
    >
      <Flex width='full' justifyContent='space-between' alignItems='center'>
        <card.icon fontSize='2rem' />
      </Flex>
      <Box width='full'>
        <Text
          textAlign='left'
          as='h3'
          fontSize={{ base: '1.24rem', sm: '1.4rem' }}
          letterSpacing='1px'
          fontWeight={500}
        >
          {card.title}
        </Text>
      </Box>
    </Button>
  );
}
