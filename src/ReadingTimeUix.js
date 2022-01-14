import { useState, useEffect } from 'react';

import {
    Wrapper,
    useUiExtension,
} from '@graphcms/uix-react-sdk'

import TimerIcon from './timer-2-line.svg';

const calculateReadingTime = (text) => {
    const wordsPerMinute = 200
    const words = text.split(' ').length
    const minutes = Math.ceil(words / wordsPerMinute)
    return minutes
}

const calculateWordCount = (text) => {
    const words = text.split(' ').length;
    return Math.ceil(words);
}

const ReadingTime = () => {
    const { sidebarConfig, form: { subscribeToFieldState, getFieldState } } = useUiExtension();
    const [ readingTime, setReadingTime ] = useState('');
    const [ wordCount, setWordCount ] = useState('');

    const contentFieldApiId = sidebarConfig.API_ID;

    getFieldState(contentFieldApiId).then((state) => {
        let time = calculateReadingTime(state.value);
        setReadingTime(time);

        let words = calculateWordCount(state.value);
        setWordCount(words);
    });

    useEffect(() => {
        
        async function subscribe() {
            await subscribeToFieldState(
                contentFieldApiId,
                state => {
                    let time = calculateReadingTime(state.value);
                    setReadingTime(time);

                    let words = calculateWordCount(state.value);
                    setWordCount(words);
                },
                { value: true }
            );
        }
        return () => subscribe();
    },[subscribeToFieldState, contentFieldApiId]);

    return (
        <div>
            <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                <img src={TimerIcon} alt='Timer' />
                <div style={{marginLeft: '5px'}}>{readingTime || `1`} min</div>
            </div>
            <div>
                {wordCount || `0`} words
            </div>
        </div>
    );
};

const declaration = {
    name: 'Reading Time',
    description: 'Calculates reading time of content',
    extensionType: 'formSidebar',
    sidebarConfig: {
        API_ID: {
            type: 'string',
            displayName: 'Content Field API ID',
            description: 'Enter the API ID of the field you want to calculate',
            required: true,
        }
    }
};

const ReadingTimeExtension = () => {
    return (
        <Wrapper declaration={declaration}>
            <ReadingTime />
        </Wrapper>
    )
}

export default ReadingTimeExtension;