import { Dimensions, StyleSheet, View } from 'react-native';
import Skeleton from './Skeleton';

const { width, height } = Dimensions.get('window');

const ProductDetailSkeleton = () => {
  return (
    <View style={styles.container}>
      {/* Image Carousel Area */}
      {/* We keep this simpler because usually the shared image sits on top, 
          but a placeholder behind it helps if fresh load */}
      <Skeleton width={width} height={width * 1.1} borderRadius={0} />

      <View style={styles.content}>
        {/* Title Lines */}
        <Skeleton width="90%" height={24} style={{ marginBottom: 10 }} />
        <Skeleton width="60%" height={24} style={{ marginBottom: 20 }} />

        {/* Price Row */}
        <View style={styles.row}>
            <Skeleton width={100} height={32} />
            <Skeleton width={60} height={20} style={{ marginLeft: 16 }} />
        </View>

        <View style={styles.divider} />

        {/* Size/Variant Options */}
        <Skeleton width={80} height={16} style={{ marginBottom: 12 }} />
        <View style={styles.row}>
            <Skeleton width={50} height={32} borderRadius={8} style={{ marginRight: 10 }} />
            <Skeleton width={50} height={32} borderRadius={8} style={{ marginRight: 10 }} />
            <Skeleton width={50} height={32} borderRadius={8} />
        </View>

        <View style={styles.divider} />

        {/* Description */}
        <Skeleton width={100} height={16} style={{ marginBottom: 12 }} />
        <Skeleton width="100%" height={12} style={{ marginBottom: 8 }} />
        <Skeleton width="100%" height={12} style={{ marginBottom: 8 }} />
        <Skeleton width="80%" height={12} style={{ marginBottom: 8 }} />
      </View>
    </View>
  );
};

export default ProductDetailSkeleton;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    padding: 16,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: -24,
    backgroundColor: '#fff',
  },
  row: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 20,
  },
  divider: {
      height: 1,
      backgroundColor: '#f5f5f5',
      marginVertical: 16,
  }
});
