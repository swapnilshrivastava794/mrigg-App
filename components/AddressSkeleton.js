import { FlatList, StyleSheet, View } from 'react-native';
import Skeleton from './Skeleton';

const AddressSkeleton = () => {
    return (
        <View style={styles.container}>
             {/* Header Button */}
            <Skeleton width="100%" height={56} borderRadius={12} style={{ marginBottom: 20 }} />

            <FlatList
                data={[1, 2, 3]}
                keyExtractor={(item) => item.toString()}
                showsVerticalScrollIndicator={false}
                renderItem={() => (
                    <View style={styles.card}>
                        <View style={styles.header}>
                            <Skeleton width={20} height={20} borderRadius={10} style={{ marginRight: 12 }} />
                            <View>
                                <Skeleton width={120} height={16} style={{ marginBottom: 4 }} />
                                <Skeleton width={80} height={12} />
                            </View>
                        </View>
                        <View style={{ height: 1, backgroundColor: '#f0f0f0', marginVertical: 12 }} />
                        <View style={{ paddingLeft: 32 }}>
                            <Skeleton width="90%" height={14} style={{ marginBottom: 6 }} />
                            <Skeleton width="60%" height={14} />
                        </View>
                    </View>
                )}
            />
        </View>
    );
};

export default AddressSkeleton;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#F4F6F8',
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#f0f0f0',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
    }
});
