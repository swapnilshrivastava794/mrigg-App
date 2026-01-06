import { FlatList, StyleSheet, View } from 'react-native';
import Skeleton from './Skeleton';

const OrderListSkeleton = () => {
    return (
        <View style={styles.container}>
            <FlatList
                data={[1, 2, 3, 4, 5]}
                keyExtractor={(item) => item.toString()}
                contentContainerStyle={{ padding: 16 }}
                showsVerticalScrollIndicator={false}
                renderItem={() => (
                    <View style={styles.card}>
                        {/* Header Row (Status & Date) */}
                        <View style={styles.headerRow}>
                            <Skeleton width={100} height={16} borderRadius={20} />
                            <Skeleton width={80} height={14} />
                        </View>
                        
                        <View style={styles.divider} />

                        {/* Product Row */}
                        <View style={styles.row}>
                            {/* Image Box */}
                            <Skeleton width={70} height={70} borderRadius={8} style={{ marginRight: 16 }} />
                            
                            {/* Details */}
                            <View style={{ flex: 1 }}>
                                <Skeleton width="70%" height={16} style={{ marginBottom: 8 }} />
                                <Skeleton width="40%" height={14} style={{ marginBottom: 8 }} />
                                <Skeleton width={60} height={16} />
                            </View>

                            {/* Chevron */}
                            <Skeleton width={20} height={20} borderRadius={10} />
                        </View>
                    </View>
                )}
            />
        </View>
    );
};

export default OrderListSkeleton;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F1F3F6',
    },
    card: {
        backgroundColor: '#fff',
        marginBottom: 16,
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: '#F0F0F0',
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    divider: {
        height: 1,
        backgroundColor: '#F9F9F9',
        marginBottom: 16,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
    }
});
