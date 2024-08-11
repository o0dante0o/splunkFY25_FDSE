import React, { Component } from 'react';
import Multiselect from '@splunk/react-ui/Multiselect';
import axios from 'axios';

class TagsComponent extends Component {
    constructor(props) {
        super(props);

        this.state = {
            tags: props.tags || [],
        };
    }

    handleChange = (e, { values }) => {
        const { id, onUpdateTags } = this.props;
        const newTags = values.filter((tag) => !this.state.tags.includes(tag));
        const removedTags = this.state.tags.filter((tag) => !values.includes(tag));

        newTags.forEach((tag) => this.addTag(id, tag));
        removedTags.forEach((tag) => this.removeTag(id, tag));

        this.setState({ tags: values }, () => {
            onUpdateTags(id, values);
        });
    };

    addTag = (id, tag) => {
        axios
            .post(
                `https://ve0g3ekx8b.execute-api.us-east-1.amazonaws.com/dev/add?type=add_tag&id=${id}`,
                { tag }
            )
            .then((response) => {
                console.log('Tag added:', response.data);
            })
            .catch((error) => {
                console.error('Error adding tag:', error);
            });
    };

    removeTag = (id, tag) => {
        axios
            .post(
                `https://ve0g3ekx8b.execute-api.us-east-1.amazonaws.com/dev/remove?type=remove_tag&id=${id}`,
                { tag }
            )
            .then((response) => {
                console.log('Tag removed:', response.data);
            })
            .catch((error) => {
                console.error('Error removing tag:', error);
            });
    };

    render() {
        return (
            <Multiselect
                allowNewValues
                values={this.state.tags}
                onChange={this.handleChange}
                inline
            >
                {this.state.tags.map((tag) => (
                    <Multiselect.Option key={tag} label={tag} value={tag} />
                ))}
            </Multiselect>
        );
    }
}

export default TagsComponent;