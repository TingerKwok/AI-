import { PracticeData, PracticeLevel } from './types';

export const PRACTICE_DATA: PracticeData = {
  [PracticeLevel.Phonemes]: [
    {
      title: 'Vowels (元音)',
      categories: [
        {
          title: 'Long Vowels (长元音)',
          items: [
            { text: '/iː/', ipa: '/iː/', exampleWord: 'see' },
            { text: '/ɜː/', ipa: '/ɜː/', exampleWord: 'bird' },
            { text: '/ɑː/', ipa: '/ɑː/', exampleWord: 'father' },
            { text: '/ɔː/', ipa: '/ɔː/', exampleWord: 'saw' },
            { text: '/uː/', ipa: '/uː/', exampleWord: 'blue' },
          ],
        },
        {
          title: 'Short Vowels (短元音)',
          items: [
            { text: '/ɪ/', ipa: '/ɪ/', exampleWord: 'sit' },
            { text: '/e/', ipa: '/e/', exampleWord: 'bed' },
            { text: '/æ/', ipa: '/æ/', exampleWord: 'cat' },
            { text: '/ə/', ipa: '/ə/', exampleWord: 'about' },
            { text: '/ʌ/', ipa: '/ʌ/', exampleWord: 'cup' },
            { text: '/ɒ/', ipa: '/ɒ/', exampleWord: 'pot' },
            { text: '/ʊ/', ipa: '/ʊ/', exampleWord: 'put' },
          ],
        },
        {
          title: 'Diphthongs (双元音)',
          items: [
            { text: '/eɪ/', ipa: '/eɪ/', exampleWord: 'say' },
            { text: '/aɪ/', ipa: '/aɪ/', exampleWord: 'my' },
            { text: '/ɔɪ/', ipa: '/ɔɪ/', exampleWord: 'boy' },
            { text: '/aʊ/', ipa: '/aʊ/', exampleWord: 'now' },
            { text: '/əʊ/', ipa: '/əʊ/', exampleWord: 'go' },
            { text: '/ɪə/', ipa: '/ɪə/', exampleWord: 'here' },
            { text: '/eə/', ipa: '/eə/', exampleWord: 'hair' },
            { text: '/ʊə/', ipa: '/ʊə/', exampleWord: 'tour' },
          ],
        },
      ],
    },
    {
      title: 'Consonants (辅音)',
      categories: [
        {
          title: 'Voiceless Consonants (清辅音)',
          items: [
            { text: '/p/', ipa: '/p/', exampleWord: 'pen' },
            { text: '/t/', ipa: '/t/', exampleWord: 'tea' },
            { text: '/k/', ipa: '/k/', exampleWord: 'cat' },
            { text: '/f/', ipa: '/f/', exampleWord: 'fan' },
            { text: '/s/', ipa: '/s/', exampleWord: 'see' },
            { text: '/ʃ/', ipa: '/ʃ/', exampleWord: 'she' },
            { text: '/θ/', ipa: '/θ/', exampleWord: 'think' },
            { text: '/h/', ipa: '/h/', exampleWord: 'hot' },
            { text: '/tʃ/', ipa: '/tʃ/', exampleWord: 'chair' },
            { text: '/tr/', ipa: '/tr/', exampleWord: 'try' },
            { text: '/ts/', ipa: '/ts/', exampleWord: 'cats' },
          ],
        },
        {
          title: 'Voiced Consonants (浊辅音)',
          items: [
            { text: '/b/', ipa: '/b/', exampleWord: 'bad' },
            { text: '/d/', ipa: '/d/', exampleWord: 'did' },
            { text: '/g/', ipa: '/g/', exampleWord: 'go' },
            { text: '/v/', ipa: '/v/', exampleWord: 'van' },
            { text: '/z/', ipa: '/z/', exampleWord: 'zoo' },
            { text: '/ʒ/', ipa: '/ʒ/', exampleWord: 'vision' },
            { text: '/ð/', ipa: '/ð/', exampleWord: 'this' },
            { text: '/r/', ipa: '/r/', exampleWord: 'red' },
            { text: '/dʒ/', ipa: '/dʒ/', exampleWord: 'jam' },
            { text: '/dr/', ipa: '/dr/', exampleWord: 'dry' },
            { text: '/dz/', ipa: '/dz/', exampleWord: 'beds' },
            { text: '/m/', ipa: '/m/', exampleWord: 'man' },
            { text: '/n/', ipa: '/n/', exampleWord: 'no' },
            { text: '/ŋ/', ipa: '/ŋ/', exampleWord: 'sing' },
            { text: '/l/', ipa: '/l/', exampleWord: 'leg' },
            { text: '/w/', ipa: '/w/', exampleWord: 'wet' },
            { text: '/j/', ipa: '/j/', exampleWord: 'yes' },
          ],
        },
      ],
    },
  ],
  [PracticeLevel.Words]: [
    { text: 'apple', ipa: '/ˈæpəl/' },
    { text: 'beautiful', ipa: '/ˈbjuːtɪfəl/' },
    { text: 'pronunciation', ipa: '/prəˌnʌnsiˈeɪʃən/' },
    { text: 'language', ipa: '/ˈlæŋɡwɪdʒ/' },
    { text: 'technology', ipa: '/tɛkˈnɒlədʒi/' },
    { text: 'communication', ipa: '/kəˌmjuːnɪˈkeɪʃən/' },
    { text: 'exercise', ipa: '/ˈɛksərsaɪz/' },
    { text: 'environment', ipa: '/ɪnˈvaɪrənmənt/' },
  ],
  [PracticeLevel.Phrases]: [
    { text: 'nice to meet you', ipa: '/naɪs tə miːt juː/' },
    { text: 'how are you doing', ipa: '/haʊ ər juː ˈduːɪŋ/' },
    { text: 'I appreciate it', ipa: '/aɪ əˈpriːʃiˌeɪt ɪt/' },
    { text: 'Could you please repeat that?', ipa: '/kʊd juː pliːz rɪˈpiːt ðæt/' },
    { text: 'on the other hand', ipa: '/ɑːn ðə ˈʌðər hænd/' },
  ],
  [PracticeLevel.Sentences]: [
    { text: 'The quick brown fox jumps over the lazy dog.', ipa: '/ðə kwɪk braʊn fɑːks dʒʌmps ˈoʊvər ðə ˈleɪzi dɔːɡ/' },
    { text: 'Practice makes perfect.', ipa: '/ˈpræktɪs meɪks ˈpɜːrfɪkt/' },
    { text: 'I am learning to speak English more fluently.', ipa: '/aɪ æm ˈlɜːrnɪŋ tuː spiːk ˈɪŋɡlɪʃ mɔːr ˈfluːəntli/' },
    { text: 'She sells seashells by the seashore.', ipa: '/ʃiː sɛlz ˈsiːʃɛlz baɪ ðə ˈsiːʃɔːr/' },
  ],
};