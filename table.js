import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Table = ({ data, columns }) => {
  return (
    <View style={styles.table}>
      <View style={styles.tableHeader}>
        {columns.map((column, index) => (
          <Text key={index} style={styles.columnHeader}>
            {column}
          </Text>
        ))}
      </View>
      {data.map((row, rowIndex) => (
        <View key={rowIndex} style={styles.tableRow}>
          {columns.map((column, colIndex) => (
            <Text key={colIndex} style={styles.tableCell}>
              {row[column]}
            </Text>
          ))}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  table: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    overflow: 'hidden',
    marginBottom: 50,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#3d218b',
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  columnHeader: {
    flex: 1,
    textAlign: 'center',
    borderRightWidth: 1,
    borderColor: '#ccc',
    color: '#fff',
    fontWeight: 'bold',
    paddingVertical: 10,
    paddingHorizontal: 5,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#E0E0E0',
  },
  tableCell: {
    flex: 1,
    marginHorizontal: 5,
    paddingVertical: 15,
    paddingHorizontal: 10,
    textAlign: 'center',
    borderRightWidth: 1,
    borderColor: '#ccc',
    color: '#000',
    fontSize: 14,
    width: '10%',
  },
});

export default Table;
