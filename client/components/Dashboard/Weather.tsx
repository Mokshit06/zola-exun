import {
  Box,
  Flex,
  Heading,
  Image,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import { css } from '@emotion/react';
import { useWeather } from 'hooks/api-hooks';
import useGeolocation from 'hooks/useGeolocation';
import { DateTime } from 'luxon';

export default function Weather() {
  const { location, error } = useGeolocation();
  const { data } = useWeather(location?.latitude, location?.longitude);
  const bgColor = useColorModeValue('#edf2f7', '#2c313d');

  const date = new Date();
  const formattedDate = DateTime.fromJSDate(date).toFormat('d LLL yyyy');

  if (!data) return null;

  return (
    <Box bgColor={bgColor} borderBottomRadius='50px' py='1.8rem' px='2.3rem'>
      <Flex alignItems='flex-end' my='1rem'>
        <Image src={data.icon} height={50} width={50} />
        <Flex ml='0.7rem' flexDir='column'>
          <Text fontSize='0.9rem'>{formattedDate}</Text>
          <Heading as='h2' fontWeight={500} fontSize='1.7rem'>
            {data.weather}
          </Heading>
        </Flex>
      </Flex>
      <Box pos='relative'>
        <Box
          height='full'
          pos='absolute'
          boxShadow={`inset 5px 0px 8px 0px ${bgColor}, inset -5px 0px 8px 0px ${bgColor}`}
          top={0}
          right={0}
          left={0}
          bottom={0}
          width='full'
          pointerEvents='none'
        />
        <Flex
          alignItems='center'
          justifyContent='space-between'
          overflowX='auto'
          flexWrap='nowrap'
          css={css`
            &::-webkit-scrollbar {
              display: none;
              width: 0;
            }
          `}
        >
          <Temperature data={data.temperature} title='Temp.' />
          <Temperature data={data.minTemp} title='Min Temp.' />
          <Temperature data={data.maxTemp} title='Max Temp.' />
          <Temperature data={data.humidity} title='Humidity' />
          <Temperature data={data.feelsLike} title='Feels like' />
        </Flex>
      </Box>
    </Box>
  );
}

interface TemperatureProps {
  data: number;
  title: string;
}

function Temperature({ data, title }: TemperatureProps) {
  const textColor = useColorModeValue('#5c5c5c', 'gray.200');
  const darkTextColor = useColorModeValue('#666', 'gray.300');

  return (
    <Box px='0.5rem' mx='0.5rem' minW={{ base: 'max-content', sm: null }}>
      <Text fontSize='1.1rem' fontWeight={500} color={textColor} mb='0.2rem'>
        {data}
      </Text>
      <Text fontSize='0.92rem' color={darkTextColor}>
        {title}
      </Text>
    </Box>
  );
}
