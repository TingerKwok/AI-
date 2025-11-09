import React from 'react';
import { PhonemeSuperCategory } from '../types';
import { PhonemeIcon } from './Icons';

interface PhonemePathProps {
    phonemeData: PhonemeSuperCategory[];
    onSelectCategory: (category: string) => void;
    onBack?: () => void; // This prop is kept for type consistency but is unused.
}

const phonemeCategoryConfig: {[key: string]: { color: string, hover: string }} = {
    'Long Vowels (长元音)': { color: 'bg-red-500', hover: 'hover:bg-red-600' },
    'Short Vowels (短元音)': { color: 'bg-orange-500', hover: 'hover:bg-orange-600' },
    'Diphthongs (双元音)': { color: 'bg-yellow-500', hover: 'hover:bg-yellow-600' },
    'Voiceless Consonants (清辅音)': { color: 'bg-blue-500', hover: 'hover:bg-blue-600' },
    'Voiced Consonants (浊辅音)': { color: 'bg-indigo-500', hover: 'hover:bg-indigo-600' },
};

// The main LevelPath component has been removed as per the new requirements.
// Only PhonemePath remains, and it has been simplified.
export const PhonemePath: React.FC<PhonemePathProps> = ({ phonemeData, onSelectCategory }) => {
    const allCategories = phonemeData.flatMap(sup => sup.categories);

    return (
        <div className="w-full max-w-sm mx-auto py-8">
            <h2 className="text-3xl font-bold text-center mb-10 text-gray-800 dark:text-gray-200">音标关卡</h2>
            <div className="relative">
                <div className="absolute left-1/2 -translate-x-1/2 top-10 bottom-10 w-1 border-l-2 border-dashed border-gray-300 dark:border-gray-600 -z-10"></div>
                
                <ul className="space-y-8">
                    {allCategories.map((category) => {
                        const config = phonemeCategoryConfig[category.title] || { color: 'bg-gray-500', hover: 'hover:bg-gray-600' };
                        const [title, subtitle] = category.title.split(' (');

                        return (
                            <li key={category.title} className="flex items-center">
                                <div className="flex-1 text-right pr-6">
                                    <h3 className="font-bold text-lg text-gray-800 dark:text-gray-200">{title}</h3>
                                    <p className="text-gray-500 dark:text-gray-400">({subtitle}</p>
                                </div>

                                <div className="relative">
                                    <button
                                        onClick={() => onSelectCategory(category.title)}
                                        className={`w-20 h-20 rounded-full flex items-center justify-center text-white shadow-lg transform transition-transform duration-200 ${config.color} ${config.hover} hover:scale-105`}
                                        aria-label={`Start ${title}`}
                                    >
                                        <PhonemeIcon className="w-10 h-10" />
                                    </button>
                                </div>
                                
                                <div className="flex-1"></div>
                            </li>
                        );
                    })}
                </ul>
            </div>
        </div>
    );
};