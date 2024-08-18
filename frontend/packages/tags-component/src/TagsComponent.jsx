import React, { useState, useContext } from 'react';
import Multiselect from '@splunk/react-ui/Multiselect';
import { GlobalContext } from '@splunk/global-state';

/**
 * TagsComponent
 *
 * A component that allows users to add and remove tags using a multiselect input.
 *
 * @param {Object} props - The component props.
 * @param {string} props.id - The unique identifier for the item being tagged.
 * @param {string[]} props.tags - The initial tags for the item.
 * @param {string} props.customKey - A custom key to categorize the tags.
 *
 * @returns {JSX.Element} The rendered tags component.
 */
const TagsComponent = ({ id, tags: initialTags, customKey }) => {
    // Get the addTag and removeTag functions from the global context
    const { addTag, removeTag } = useContext(GlobalContext);

    // State to manage the current tags
    const [tags, setTags] = useState(initialTags || []);

    /**
     * handleChange
     *
     * Handles the change event for the multiselect input.
     *
     * @param {Object} e - The event object.
     * @param {string[]} values - The new values for the tags.
     */
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
