import React, { useState, useContext } from 'react';
import Multiselect from '@splunk/react-ui/Multiselect';
import { GlobalContext } from '@splunk/global-state';

const TagsComponent = ({ id, tags: initialTags, customKey }) => {
    const { addTag, removeTag } = useContext(GlobalContext);
    const [tags, setTags] = useState(initialTags || []);

    const handleChange = (e, { values }) => {
        const newTags = values.filter((tag) => !tags.includes(tag));
        const removedTags = tags.filter((tag) => !values.includes(tag));

        newTags.forEach((tag) => addTag(id, tag, customKey));
        removedTags.forEach((tag) => removeTag(id, tag, customKey));

        setTags(values);
    };

    return (
        <Multiselect allowNewValues values={tags} onChange={handleChange} inline>
            {tags.map((tag) => (
                <Multiselect.Option key={tag} label={tag} value={tag} />
            ))}
        </Multiselect>
    );
};

export default TagsComponent;
