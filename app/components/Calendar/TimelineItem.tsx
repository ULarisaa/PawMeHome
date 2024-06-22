import React, { useState } from 'react';
import { View, Text, Alert, TouchableOpacity, Modal, FlatList, Image } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { SERVER_URL } from '../../utils/consts';
import { useCalendarstyles } from './styles';

const TimelineItem = ({ event, onEdit, onDelete }) => {
    const [expandedSection, setExpandedSection] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [modalContent, setModalContent] = useState([]);
    const [modalType, setModalType] = useState('');
    const styles = useCalendarstyles();
    console.log(event);

    const toggleDetails = () => {
        setExpandedSection(expandedSection === 'details' ? null : 'details');
    };

    const togglePdf = () => {
        setExpandedSection(expandedSection === 'pdf' ? null : 'pdf');
    };

    const toggleImage = () => {
        setExpandedSection(expandedSection === 'image' ? null : 'image');
    };

    const handleDelete = async () => {
        const dateTime = new Date(event.eventdate);
        const formattedDate = `${dateTime.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        })} at ${dateTime.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
        })}`;

        const displayInfo = event.typeofevent === 'custom' ? event.titleofevent : event.typeofevent;

        Alert.alert(
            "Confirm Event Deletion",
            `\nAre you sure you want to delete the event of ${displayInfo} scheduled for ${formattedDate}?`,
            [
                {
                    text: "Cancel",
                    style: "cancel",
                },
                {
                    text: "Delete",
                    onPress: async () => {
                        try {
                            const response = await fetch(`${SERVER_URL}/events/${event.eventid}`, {
                                method: 'DELETE',
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                            });

                            if (response.ok) {
                                onDelete(event);
                            } else {
                                throw new Error('Failed to delete the event');
                            }
                        } catch (error) {
                            console.error('Error deleting event:', error);
                            Alert.alert('Error', 'Failed to delete the event');
                        }
                    },
                    style: "destructive",
                },
            ]
        );
    };

    const openModal = (attachments, type, index) => {
        const file = type === 'pdf' ? event.files[index] : event.images[index];
        if (file) {
            setModalContent([file]);
            setModalType(type);
            setModalVisible(true);
        } else {
            console.log(`Nu există fișiere de tip ${type} de afișat`);
        }
    };
    
    const renderAttachmentLinks = (attachments, type) => {
        if (attachments && attachments.length > 0) {
            return (
                <View style={styles.attachmentContainer}>
                    {attachments.map((attachment, index) => (
                        <TouchableOpacity key={index} onPress={() => openModal(attachments, type, index)}>
                            <Text style={styles.attachmentLink}>{type === 'pdf' ? `File ${index + 1}` : `Image ${index + 1}`}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            );
        }
        return null;
    };
    

    const renderModalContent = () => {
        return (
            <FlatList
                data={modalContent}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                    <Image source={{ uri: item }} style={{ width: '100%', height: modalType === 'pdf' ? 500 : 300 }} resizeMode="contain" />
                )}
            />
        );
    };

    return (
        <View style={styles.timelineItem}>
            <View style={styles.eventMainInfo}>
                <Text style={styles.timeText}>
                    {new Date(event.eventdate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </Text>
                <Text style={styles.eventTitle}>
                    {event.typeofevent === 'custom' ? event.titleofevent : event.typeofevent.charAt(0).toUpperCase() + event.typeofevent.slice(1).toLowerCase()}
                </Text>
                <View style={styles.buttonsContainer}>
    {event.details && event.details.trim() !== '' && (
        <TouchableOpacity onPress={toggleDetails} style={styles.infoButton}>
            <Icon name="info" size={24} color="#007AFF" />
        </TouchableOpacity>
    )}
    {event.files && event.files.filter(file => file !== null).length > 0 && (
        <TouchableOpacity onPress={togglePdf} style={styles.infoButton}>
            <Icon name="attach-file" size={24} color="#673AB7" />
        </TouchableOpacity>
    )}
    {event.images && event.images.filter(image => image !== null).length > 0 && (
        <TouchableOpacity onPress={toggleImage} style={styles.infoButton}>
            <Icon name="image" size={24} color="#FF9800" />
        </TouchableOpacity>
    )}
    <TouchableOpacity onPress={() => onEdit(event)} style={styles.editButton}>
        <Icon name="edit" size={24} color="#4CAF50" />
    </TouchableOpacity>
    <TouchableOpacity onPress={handleDelete} style={styles.deleteButton}>
        <Icon name="delete" size={24} color="#F44336" />
    </TouchableOpacity>
</View>

            </View>
            {expandedSection === 'details' && (
                <Text style={styles.detailsText}>{event.details}</Text>
            )}
           {expandedSection === 'pdf' && event.files && event.files.length > 0 && (
                renderAttachmentLinks(event.files, 'pdf')
            )}
            {expandedSection === 'image' && event.images && event.images.length > 0 && (
                renderAttachmentLinks(event.images, 'image')
            )}

            <Modal
                visible={modalVisible}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeButton}>
                            <Icon name="close" size={30} color="#000" />
                        </TouchableOpacity>
                        {renderModalContent()}
                    </View>
                </View>
            </Modal>
        </View>
    );
};

export default TimelineItem;

