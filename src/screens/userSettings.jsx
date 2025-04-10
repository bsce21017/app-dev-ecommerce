import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable, Alert, ActivityIndicator, Image } from 'react-native';
import { getAuth, updatePassword, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';
import { doc, updateDoc, getFirestore, getDoc } from 'firebase/firestore';
import { auth, db } from '../../firebaseConfig';
import Icon from 'react-native-vector-icons/FontAwesome';
import { launchImageLibrary } from 'react-native-image-picker';
import ImageResizer from '@bam.tech/react-native-image-resizer';
import axios from 'axios';

const SettingsScreen = ({navigation}) => {
    const [username, setUsername] = useState('');
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('account');
    const [profileImage, setProfileImage] = useState(null);
    const [tempImageUri, setTempImageUri] = useState(null);
    const [uploadProgress, setUploadProgress] = useState(0);

    const IMGBB_API_KEY = '154d0923e02aa6b645443b5e26257bab';

    useEffect(() => {
        const loadUserData = async () => {
            const userDoc = await getDoc(doc(db, 'customers', auth.currentUser.uid));
            if (userDoc.exists()) {
                setUsername(userDoc.data().name || '');
                setProfileImage(userDoc.data().profileImage || null);
            }
        };
        loadUserData();
    }, []);

    const compressImage = async (uri) => {
        try {
            const result = await ImageResizer.resize({
                uri,
                width: 1200,
                height: 1200,
                compressFormat: 'JPEG',
                quality: 70,
                mode: 'contain'
            });
            return result.uri;
        } catch (error) {
            console.warn('Compression failed, using original:', error);
            return uri;
        }
    };

    const uploadToImgBB = async (uri) => {
        try {
            const compressedUri = await compressImage(uri);

            const formData = new FormData();
            formData.append('image', {
                uri: compressedUri,
                type: 'image/jpeg',
                name: `profile_${Date.now()}.jpg`,
            });

            const response = await axios.post(
                `https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                    onUploadProgress: (progressEvent) => {
                        const progress = Math.round(
                            (progressEvent.loaded * 100) / progressEvent.total
                        );
                        setUploadProgress(progress);
                    },
                }
            );

            return response.data.data.url;
        } catch (error) {
            console.error('ImgBB upload error:', error);
            throw error;
        }
    };

    const pickImage = async () => {
        const result = await launchImageLibrary({
            mediaType: 'photo',
            quality: 0.8,
            includeBase64: false,
        });

        if (!result.didCancel && result.assets?.length > 0) {
            setTempImageUri(result.assets[0].uri);
        }
    };

    const handleUpdateProfile = async () => {
        setLoading(true);
        try {
            const updates = {};

            if (username.trim() && username !== auth.currentUser.displayName) {
                updates.username = username.trim();
            }
            if (tempImageUri) {
                const imageUrl = await uploadToImgBB(tempImageUri);
                updates.profileImage = imageUrl;
                setProfileImage(imageUrl);
                setTempImageUri(null);
            }

            if (Object.keys(updates).length > 0) {
                await updateDoc(doc(db, 'customers', auth.currentUser.uid), updates);
                Alert.alert('Success', 'Profile updated successfully');
                navigation.navigate('UserHome');
            } else {
                Alert.alert('Info', 'No changes to update');
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            Alert.alert('Error', error.message || 'Failed to update profile');
        } finally {
            setLoading(false);
            setUploadProgress(0);
        }
    };

    const handleUpdatePassword = async () => {
        if (!currentPassword || !newPassword || !confirmPassword) {
            Alert.alert('Error', 'Please fill all password fields');
            return;
        }

        if (newPassword !== confirmPassword) {
            Alert.alert('Error', 'New passwords do not match');
            return;
        }

        if (newPassword.length < 6) {
            Alert.alert('Error', 'Password must be at least 6 characters');
            return;
        }

        setLoading(true);
        try {
            const user = auth.currentUser;
            const credential = EmailAuthProvider.credential(user.email, currentPassword);

            await reauthenticateWithCredential(user, credential);
            await updatePassword(user, newPassword);

            Alert.alert('Success', 'Password updated successfully');
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
            navigation.navigate('UserHome');
        } catch (error) {
            console.error('Error updating password:', error);
            Alert.alert('Error', error.message || 'Failed to update password');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>SETTINGS</Text>
            </View>

            <View style={styles.tabsContainer}>
                <Pressable
                    style={[styles.tab, activeTab === 'account' && styles.activeTab]}
                    onPress={() => setActiveTab('account')}
                >
                    <Text style={[styles.tabText, activeTab === 'account' && styles.activeTabText]}>
                        Account
                    </Text>
                </Pressable>
                <Pressable
                    style={[styles.tab, activeTab === 'security' && styles.activeTab]}
                    onPress={() => setActiveTab('security')}
                >
                    <Text style={[styles.tabText, activeTab === 'security' && styles.activeTabText]}>
                        Security
                    </Text>
                </Pressable>
            </View>

            {activeTab === 'account' ? (
                <View style={styles.section}>
                    <View style={styles.profileImageContainer}>
                        <Pressable onPress={pickImage}>
                            {tempImageUri || profileImage ? (
                                <Image
                                    source={{ uri: tempImageUri || profileImage }}
                                    style={styles.profileImage}
                                />
                            ) : (
                                <View style={styles.profileImagePlaceholder}>
                                    <Icon name="user" size={40} color="#E7C574" />
                                </View>
                            )}
                        </Pressable>
                        <Pressable onPress={pickImage} style={styles.changePhotoButton}>
                            <Text style={styles.changePhotoText}>Change Photo</Text>
                        </Pressable>
                        {uploadProgress > 0 && uploadProgress < 100 && (
                            <View style={styles.progressBarContainer}>
                                <View style={[styles.progressBar, { width: `${uploadProgress}%` }]} />
                                <Text style={styles.progressText}>{uploadProgress}%</Text>
                            </View>
                        )}
                    </View>

                    <Text style={styles.sectionTitle}>UPDATE PROFILE</Text>

                    <View style={styles.inputContainer}>
                        <Icon name="user" size={16} color="#E7C574" style={styles.inputIcon} />
                        <TextInput
                            style={styles.input}
                            placeholder="Username"
                            placeholderTextColor="#666"
                            value={username}
                            onChangeText={setUsername}
                            autoCapitalize="none"
                        />
                    </View>

                    <Pressable
                        style={styles.saveButton}
                        onPress={handleUpdateProfile}
                        disabled={loading || (!username.trim() && !tempImageUri)}
                    >
                        {loading ? (
                            <ActivityIndicator color="#000" />
                        ) : (
                            <Text style={styles.buttonText}>Update Profile</Text>
                        )}
                    </Pressable>
                </View>
            ) : (
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>CHANGE PASSWORD</Text>

                    <View style={styles.inputContainer}>
                        <Icon name="lock" size={16} color="#E7C574" style={styles.inputIcon} />
                        <TextInput
                            style={styles.input}
                            placeholder="Current password"
                            placeholderTextColor="#666"
                            value={currentPassword}
                            onChangeText={setCurrentPassword}
                            secureTextEntry
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <Icon name="key" size={16} color="#E7C574" style={styles.inputIcon} />
                        <TextInput
                            style={styles.input}
                            placeholder="New password"
                            placeholderTextColor="#666"
                            value={newPassword}
                            onChangeText={setNewPassword}
                            secureTextEntry
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <Icon name="key" size={16} color="#E7C574" style={styles.inputIcon} />
                        <TextInput
                            style={styles.input}
                            placeholder="Confirm new password"
                            placeholderTextColor="#666"
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                            secureTextEntry
                        />
                    </View>

                    <Pressable
                        style={styles.saveButton}
                        onPress={handleUpdatePassword}
                        disabled={loading || !currentPassword || !newPassword || !confirmPassword}
                    >
                        {loading ? (
                            <ActivityIndicator color="#000" />
                        ) : (
                            <Text style={styles.buttonText}>Update Password</Text>
                        )}
                    </Pressable>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
        padding: 20,
    },
    header: {
        marginBottom: 0,
        // alignItems: 'center',
    },
    headerTitle: {
        color: '#E7C574',
        fontSize: 24,
        fontWeight: 'bold',
        letterSpacing: 1,
    },
    tabsContainer: {
        flexDirection: 'row',
        marginBottom: 25,
        borderBottomWidth: 1,
        borderBottomColor: '#222',
    },
    tab: {
        flex: 1,
        paddingVertical: 15,
        alignItems: 'center',
        borderBottomWidth: 2,
        borderBottomColor: 'transparent',
    },
    activeTab: {
        borderBottomColor: '#E7C574',
    },
    tabText: {
        color: '#888',
        fontWeight: 'bold',
    },
    activeTabText: {
        color: '#E7C574',
    },
    section: {
        marginBottom: 20,
    },
    profileImageContainer: {
        alignItems: 'center',
        marginBottom: 25,
    },
    profileImage: {
        width: 120,
        height: 120,
        borderRadius: 60,
        borderWidth: 2,
        borderColor: '#E7C574',
    },
    profileImagePlaceholder: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: '#111',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#E7C574',
    },
    changePhotoButton: {
        marginTop: 10,
    },
    changePhotoText: {
        color: '#E7C574',
        fontSize: 14,
    },
    progressBarContainer: {
        width: '100%',
        height: 20,
        backgroundColor: '#111',
        borderRadius: 10,
        marginTop: 10,
        overflow: 'hidden',
    },
    progressBar: {
        height: '100%',
        backgroundColor: '#E7C574',
    },
    progressText: {
        position: 'absolute',
        width: '100%',
        textAlign: 'center',
        color: '#000',
        fontSize: 12,
        fontWeight: 'bold',
    },
    sectionTitle: {
        color: '#E7C574',
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 20,
        letterSpacing: 0.5,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#111',
        borderRadius: 8,
        paddingHorizontal: 15,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: '#222',
    },
    inputIcon: {
        marginRight: 10,
    },
    input: {
        flex: 1,
        color: '#FFF',
        paddingVertical: 15,
    },
    saveButton: {
        backgroundColor: '#E7C574',
        padding: 16,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 10,
    },
    buttonText: {
        color: '#000',
        fontWeight: 'bold',
        fontSize: 16,
    },
});

export default SettingsScreen;