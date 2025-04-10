import React from "react";
import { SafeAreaView, View, Text, TouchableOpacity, ScrollView, StyleSheet, Image, Dimensions } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import LinearGradient from 'react-native-linear-gradient';

const { width } = Dimensions.get('window');

const SellerProfile = ({ navigation }) => {
    const sellerName = "HLW8trDg";
    const sellerID = "PK2NBWEMR0X";
    const daysActive = 17;
    const productsCount = 42;
    const rating = 4.7;

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                {/* Profile Header */}
                <LinearGradient 
                    colors={['#1E293B', '#0B0E13']}
                    style={styles.profileHeader}
                    start={{x: 0, y: 0}}
                    end={{x: 1, y: 1}}
                >
                    <View style={styles.avatarContainer}>
                        <Image 
                            source={require("./../../assets/frame.png")} 
                            style={styles.avatar} 
                        />
                        <TouchableOpacity style={styles.editIcon}>
                            <Icon name="pencil" size={14} color="#fff" />
                        </TouchableOpacity>
                    </View>
                    <Text style={styles.name}>{sellerName}</Text>
                    <Text style={styles.subtext}>Seller ID: {sellerID}</Text>
                    
                    <View style={styles.statsContainer}>
                        <View style={styles.statItem}>
                            <Text style={styles.statValue}>{daysActive}</Text>
                            <Text style={styles.statLabel}>Days</Text>
                        </View>
                        <View style={styles.statItem}>
                            <Text style={styles.statValue}>{productsCount}</Text>
                            <Text style={styles.statLabel}>Products</Text>
                        </View>
                        <View style={styles.statItem}>
                            <Text style={styles.statValue}>{rating}</Text>
                            <Text style={styles.statLabel}>Rating</Text>
                        </View>
                    </View>
                </LinearGradient>

                
                {/* <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Seller Tools</Text>
                    <View style={styles.featuresGrid}>
                        {[
                            { icon: 'chart-line', title: 'Analytics', color: '#4CAF50' },
                            { icon: 'currency-usd', title: 'Income', color: '#8BC34A' },
                            { icon: 'package-variant', title: 'Inventory', color: '#FF9800' },
                            { icon: 'message-text', title: 'Chats', color: '#2196F3' },
                            { icon: 'truck-delivery', title: 'Orders', color: '#9C27B0' },
                            { icon: 'account-group', title: 'Customers', color: '#E91E63' },
                        ].map((item, index) => (
                            <TouchableOpacity key={index} style={styles.featureItem}>
                                <View style={[styles.featureIcon, {backgroundColor: item.color}]}>
                                    <Icon name={item.icon} size={20} color="#fff" />
                                </View>
                                <Text style={styles.featureText}>{item.title}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View> */}

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Settings</Text>
                    {[
                        { icon: 'cog', title: 'Account Settings' },
                        // { icon: 'heart-pulse', title: 'Account Health' },
                        // { icon: 'bell', title: 'Notifications' },
                        // { icon: 'shield-account', title: 'Privacy' },
                        { icon: 'translate', title: 'Language' },
                    ].map((item, index) => (
                        <TouchableOpacity key={index} style={styles.menuItem}>
                            <Icon name={item.icon} size={22} color="#F0C14B" />
                            <Text style={styles.menuText}>{item.title}</Text>
                            <Icon name="chevron-right" size={22} color="#666" />
                        </TouchableOpacity>
                    ))}
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Support</Text>
                    {[
                        { icon: 'chat', title: 'Live Chat' },
                        { icon: 'email', title: 'Contact Us' },
                        // { icon: 'help-circle', title: 'Help Center' },
                        { icon: 'information', title: 'About' },
                    ].map((item, index) => (
                        <TouchableOpacity key={index} style={styles.menuItem}>
                            <Icon name={item.icon} size={22} color="#F0C14B" />
                            <Text style={styles.menuText}>{item.title}</Text>
                            <Icon name="chevron-right" size={22} color="#666" />
                        </TouchableOpacity>
                    ))}
                </View>

                <TouchableOpacity style={styles.logoutButton}>
                    <Icon name="logout" size={20} color="#D9534F" />
                    <Text style={styles.logoutText}>Log Out</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: "#0F172A",
    },
    scrollContent: {
        paddingBottom: 30,
    },
    profileHeader: {
        padding: 24,
        borderRadius: 16,
        marginBottom: 16,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 8,
    },
    avatarContainer: {
        position: "relative",
        marginBottom: 12,
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 3,
        borderColor: '#F0C14B',
    },
    editIcon: {
        position: "absolute",
        bottom: 0,
        right: 0,
        backgroundColor: "#333",
        borderRadius: 12,
        padding: 5,
        borderWidth: 2,
        borderColor: '#0F172A',
    },
    name: {
        fontSize: 22,
        color: "#fff",
        fontWeight: "bold",
        marginBottom: 4,
    },
    subtext: {
        color: "#94A3B8",
        fontSize: 14,
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        marginTop: 20,
        paddingHorizontal: 20,
    },
    statItem: {
        alignItems: 'center',
    },
    statValue: {
        color: "#F0C14B",
        fontSize: 20,
        fontWeight: 'bold',
    },
    statLabel: {
        color: "#94A3B8",
        fontSize: 12,
        marginTop: 4,
    },
    quickActions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 24,
    },
    quickAction: {
        alignItems: 'center',
        width: (width - 48) / 3,
    },
    actionIconContainer: {
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    actionText: {
        color: '#E2E8F0',
        fontSize: 12,
        textAlign: 'center',
    },
    section: {
        backgroundColor: '#1E293B',
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: "#F0C14B",
        marginBottom: 12,
        paddingBottom: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#334155',
    },
    featuresGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    featureItem: {
        width: (width - 64) / 3,
        alignItems: 'center',
        marginBottom: 16,
    },
    featureIcon: {
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    featureText: {
        color: '#E2E8F0',
        fontSize: 12,
        textAlign: 'center',
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#334155',
    },
    menuText: {
        color: "#fff",
        fontSize: 15,
        marginLeft: 12,
        flex: 1,
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
        padding: 7,
        borderRadius: 8,
        width: '90%',
        borderWidth: 1,
        borderColor: '#D9534F',
        marginTop: 8,
    },
    logoutText: {
        color: "#D9534F",
        fontWeight: "600",
        marginLeft: 8,
    },
});

export default SellerProfile;