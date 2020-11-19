import { CardGrid, CardsContainer, Card } from './styles';
import { MdHighlight, MdToys, MdVideocam, MdAcUnit } from 'react-icons/md';
import { Card as CardType } from 'interfaces';

const cards: CardType[] = [
  {
    icon: MdHighlight,
    title: 'Lights',
    slug: 'lights',
  },
  {
    icon: MdToys,
    title: 'Fans',
    slug: 'fans',
  },
  {
    icon: MdVideocam,
    title: 'CCTV',
    slug: 'cctv',
  },
  {
    icon: MdAcUnit,
    title: 'AC',
    slug: 'ac',
  },
];

export default function Appliances() {
  return (
    <CardsContainer title='Recents'>
      <CardGrid>
        {cards.map((card, index) => (
          <Card key={index} card={card} />
        ))}
      </CardGrid>
    </CardsContainer>
  );
}
