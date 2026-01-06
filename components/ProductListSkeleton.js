import { Dimensions, FlatList, StyleSheet, View } from 'react-native';
import Skeleton from './Skeleton';

const { width } = Dimensions.get('window');

const ProductListSkeleton = () => {
    // Mimics the 2-column grid layout
    return (
        <View style={styles.container}>
            <FlatList
                data={[1, 2, 3, 4, 5, 6]}
                keyExtractor={(item) => item.toString()}
                numColumns={2}
                columnWrapperStyle={{ justifyContent: 'space-between' }}
                contentContainerStyle={{ padding: 16 }}
                showsVerticalScrollIndicator={false}
                renderItem={() => (
                    <View style={styles.card}>
                        {/* Image Area */}
                        <Skeleton width="100%" height={180} style={{ borderTopLeftRadius: 12, borderTopRightRadius: 12 }} />
                        
                        {/* Content Area */}
                        <View style={styles.content}>
                             {/* Brand Details */}
                             <Skeleton width={80} height={10} style={{ marginBottom: 6 }} />
                             
                             {/* Name Lines */}
                             <Skeleton width="90%" height={14} style={{ marginBottom: 4 }} />
                             <Skeleton width="60%" height={14} style={{ marginBottom: 8 }} />
                             
                             {/* Price & Button */}
                             <View style={styles.row}>
                                <Skeleton width={60} height={16} />
                                <Skeleton width={28} height={28} borderRadius={14} />
                             </View>
                        </View>
                    </View>
                )}
            />
        </View>
    );
};

export default ProductListSkeleton;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F1F3F6',
    },
    card: {
        width: '48%',
        backgroundColor: '#fff',
        borderRadius: 12,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#F0F0F0',
        overflow: 'hidden',
    },
    content: {
        padding: 12,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 4,
    }
});
