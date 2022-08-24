import { Text, Dimensions } from 'react-native';
import React from 'react';

const { width, height } = Dimensions.get('window');

export default TextReuseableComponent = ({ value, style, heading ,subHeading, title, ...textProps}) => {
    return (
        <Text
            {...textProps}
            style={[{
                fontSize: heading ? height * 0.03 : subHeading ? height * 0.025 : title ? height * .02 : height * .018,
                color: 'black',
                fontWeight: 'normal',
            }, style]}>
            {value}
        </Text>
    );
};
