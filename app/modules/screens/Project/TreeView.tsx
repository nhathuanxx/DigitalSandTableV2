import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const TreeView = ({ projectGroups, projectDetails, onCheckedChange, onTreeBuilt }) => {
  const [treeData, setTreeData] = useState([]);
  const [levelMax, setLevelMax] = useState(0);
  const [checkedDetails, setCheckedDetails] = useState<number[]>([]);

  useEffect(() => {
    const groupMap = new Map();
    projectGroups.forEach(group => {
      const parentId = group.parent_id ?? 0;
      if (!groupMap.has(parentId)) {
        groupMap.set(parentId, []);
      }
      groupMap.get(parentId).push(group);
    });

    const detailMap = new Map();
    projectDetails.forEach(detail => {
      const groupId = detail.project_group_id;
      if (!detailMap.has(groupId)) {
        detailMap.set(groupId, []);
      }
      detailMap.get(groupId).push(detail);
    });

    let maxLevel = 0;

    const buildTree = (groups, level = 0) => {
      maxLevel = Math.max(maxLevel, level);
      return groups.map(group => {
        const groupNode = {
          id: group.id,
          name: group.name,
          type: 'group',
          parent_id: group.parent_id ?? 0,
          level,
          children: [],
        };

        const details = detailMap.get(group.id) || [];
        const detailNodes = details.map(detail => ({
          id: detail.id,
          name: detail.name,
          type: 'detail',
          parent_id: group.id,
          level: level + 1,
        }));

        maxLevel = Math.max(maxLevel, level + 1);
        const childGroups = groupMap.get(group.id) || [];
        const childGroupNodes = buildTree(childGroups, level + 1);

        groupNode.children = [...detailNodes, ...childGroupNodes];
        return groupNode;
      });
    };

    const rootGroups = groupMap.get(0) || [];
    const tree = buildTree(rootGroups);
    setTreeData(tree);
    setLevelMax(maxLevel);

    if (typeof onTreeBuilt === 'function') {
      onTreeBuilt({ tree, levelMax: maxLevel });
    }
  }, [projectGroups, projectDetails]);

  const getAllDetailIds = useCallback((node) => {
    if (node.type === 'detail') return [node.id];
    return node.children.flatMap(child => getAllDetailIds(child));
  }, []);

  const isChecked = (node) => {
    const ids = getAllDetailIds(node);
    return ids.length > 0 && ids.every(id => checkedDetails.includes(id));
  };

  const isIndeterminate = (node) => {
    const ids = getAllDetailIds(node);
    return ids.some(id => checkedDetails.includes(id)) && !isChecked(node);
  };

  const toggleNode = (node, checked) => {
    const detailIds = getAllDetailIds(node);
    setCheckedDetails(prev => {
      const set = new Set(prev);
      detailIds.forEach(id => {
        if (checked) set.add(id);
        else set.delete(id);
      });
      const result = Array.from(set);
      onCheckedChange?.(result);
      return result;
    });
  };

  const toggleDetail = (id, checked) => {
    setCheckedDetails(prev => {
      const newChecked = checked ? [...prev, id] : prev.filter(d => d !== id);
      onCheckedChange?.(newChecked);
      return newChecked;
    });
  };

  const renderCheckbox = (checked, label, onPress, indeterminate = false) => (
    <TouchableOpacity onPress={onPress} style={styles.checkboxItem}>
      <Text style={styles.checkboxBox}>
        {indeterminate ? '◼' : checked ? '☑' : '☐'}
      </Text>
      <Text style={styles.checkboxLabel}>{label}</Text>
    </TouchableOpacity>
  );

  const renderTree = (nodes, level = 0) => {
    return nodes.map((node) => {
      if (node.type === 'group') {
        const checked = isChecked(node);
        const indeterminate = isIndeterminate(node);
        return (
          <View key={`group-${node.id}`} style={[styles.item, { paddingLeft: level * 16 }]}>
            {renderCheckbox(
              checked,
              node.name + (indeterminate ? ' (một phần)' : ''),
              () => toggleNode(node, !checked),
              indeterminate
            )}
            {renderTree(node.children, level + 1)}
          </View>
        );
      } else {
        const checked = checkedDetails.includes(node.id);
        return (
          <View key={`detail-${node.id}`} style={[styles.item, { paddingLeft: level * 16 }]}>
            {renderCheckbox(
              checked,
              node.name,
              () => toggleDetail(node.id, !checked)
            )}
          </View>
        );
      }
    });
  };

  return (
    <View>
      {treeData.length > 0 ? renderTree(treeData) : <Text>Không có dữ liệu</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  item: {
    marginVertical: 2,
  },
  checkboxItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
  },
  checkboxBox: {
    fontSize: 16,
    width: 22,
  },
  checkboxLabel: {
    fontSize: 15,
    color: '#333',
  },
});

export default TreeView;
