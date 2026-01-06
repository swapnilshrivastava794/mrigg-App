import { Dimensions, ScrollView, StyleSheet, View } from 'react-native';
import Skeleton from './Skeleton';

const { width } = Dimensions.get('window');

const HomeSkeleton = () => {
  return (
    <View style={styles.container}>
      {/* Banner Skeleton */}
      <Skeleton width={width} height={280} borderRadius={0} style={{ marginBottom: 20 }} />

      {/* Categories Skeleton */}
      <View style={styles.categoriesContainer}>
        {[1, 2, 3, 4, 5].map((key) => (
          <View key={key} style={styles.categoryItem}>
            <Skeleton width={64} height={64} borderRadius={32} />
            <Skeleton width={50} height={10} style={{ marginTop: 8 }} />
          </View>
        ))}
      </View>

      {/* Section 1: Latest Drops */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
            <Skeleton width={120} height={20} />
            <Skeleton width={60} height={16} />
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalList}>
            {[1, 2, 3].map(key => (
                <View key={key} style={styles.card}>
                    <Skeleton width={160} height={160} style={{ borderTopLeftRadius: 16, borderTopRightRadius: 16 }} />
                    <View style={{ padding: 10 }}>
                        <Skeleton width={80} height={10} style={{ marginBottom: 6 }} />
                        <Skeleton width={120} height={14} style={{ marginBottom: 6 }} />
                        <Skeleton width={60} height={16} />
                    </View>
                </View>
            ))}
        </ScrollView>
      </View>

       {/* Featured Banner Skeleton */}
       <View style={{ marginHorizontal: 16, marginTop: 24 }}>
          <Skeleton width={width - 32} height={160} borderRadius={16} />
       </View>

    </View>
  );
};

export default HomeSkeleton;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F1F3F6',
  },
  categoriesContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 16,
    marginBottom: 24,
  },
  categoryItem: {
    alignItems: 'center',
  },
  section: {
    marginTop: 10,
    marginBottom: 20,
  },
  sectionHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingHorizontal: 16,
      marginBottom: 16,
  },
  horizontalList: {
      paddingLeft: 16,
  },
  card: {
      width: 160,
      borderRadius: 16,
      backgroundColor: '#fff',
      marginRight: 14,
      overflow: 'hidden',
      borderWidth: 1,
      borderColor: '#f0f0f0',
  }
});
