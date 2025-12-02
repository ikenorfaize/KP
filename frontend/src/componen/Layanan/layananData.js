import jagoImg from '../../assets/jago.png';
import Tapcash from '../../assets/Tapcash.png';

export const layananData = [
  {
    id: 'tapcash',
    title: 'TapCash',
    content: 'Kartu Multi Guna PERGUNU',
    image: Tapcash,
  },
  {
    id: 'jago',
    title: 'JAGO',
    content: {
      description:
        'JAGO adalah sebuah sistem aplikasi inovatif yang dirancang khusus untuk mendukung dan memperkuat komunitas Persatuan Guru Nahdlatul Ulama (Pergunu).',
      features: ['Terpercaya', 'Layanan cepat'],
    },
    image: jagoImg,
  },
  {
    id: 'bakti',
    title: 'Kerja Bakti Bersama',
    content: 'Program gotong royong bersama guru dan masyarakat sekitar.',
    image: null,
  },
  {
    id: 'alumni',
    title: 'Kumpul Alumni Pergunu',
    content:
      'Reuni dan temu kangen para alumni Pergunu untuk mempererat silaturahmi.',
    image: null,
  },
  {
    id: 'wisata',
    title: 'Wisata Kampung Kerapu',
    content:
      'Kegiatan wisata edukatif di Kampung Kerapu bersama komunitas Pergunu.',
    image: null,
  },
];

export default layananData;
