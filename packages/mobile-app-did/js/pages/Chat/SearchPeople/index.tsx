import React, { useCallback, useEffect, useRef, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import GStyles from 'assets/theme/GStyles';
import { defaultColors } from 'assets/theme';
import { pTd } from 'utils/unit';
import navigationService from 'utils/navigationService';
import PageContainer from 'components/PageContainer';
import InputWithCancel from 'components/InputWithCancel';
import { useFocusEffect } from '@react-navigation/native';
import NoData from 'components/NoData';
import { TextL } from 'components/CommonText';
import Touchable from 'components/Touchable';
import FindMoreButton from '../components/FindMoreButton';
import { screenWidth } from '@portkey-wallet/utils/mobile/device';
import CommonAvatar from 'components/CommonAvatar';
import { useSearchChannel } from '@portkey-wallet/hooks/hooks-ca/im';
import useDebounce from 'hooks/useDebounce';
import useLockCallback from '@portkey-wallet/hooks/useLockCallback';
import CommonToast from 'components/CommonToast';
import { handleErrorMessage } from '@portkey-wallet/utils';
import { ChannelItem } from '@portkey-wallet/im/types';
import { BGStyles } from 'assets/theme/styles';

export default function SearchPeople() {
  const iptRef = useRef<any>();
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const searchChannel = useSearchChannel();

  const [keyword, setKeyword] = useState('');
  const debounceKeyword = useDebounce(keyword, 500);
  const [filterList, setFilterList] = useState<ChannelItem[]>([]);

  useFocusEffect(
    useCallback(() => {
      if (iptRef?.current) {
        timerRef.current = setTimeout(() => {
          iptRef.current.focus();
        }, 300);
      }
    }, []),
  );

  const fetchList = useLockCallback(async () => {
    try {
      const result = await searchChannel(debounceKeyword);
      console.log('result', result);
      setFilterList(result?.data?.list);
    } catch (error) {
      CommonToast.fail(handleErrorMessage(error));
    }
  }, [debounceKeyword]);

  useEffect(() => {
    if (!debounceKeyword) return setFilterList([]);
    fetchList();
  }, [debounceKeyword, fetchList]);

  useEffect(
    () => () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    },
    [],
  );

  const renderItem = useCallback(({ item }: { item: ChannelItem }) => {
    console.log(item);
    return (
      <Touchable
        style={[GStyles.flexRow, GStyles.itemCenter, styles.itemWrap]}
        onPress={() => navigationService.navigate('ChatDetails', { channelInfo: item })}>
        <CommonAvatar title={item?.displayName} hasBorder avatarSize={pTd(36)} style={styles.avatarStyle} />
        <View style={styles.rightSection}>
          <TextL numberOfLines={1}>{item?.displayName}</TextL>
        </View>
      </Touchable>
    );
  }, []);

  return (
    <PageContainer
      hideHeader
      safeAreaColor={['blue', 'gray']}
      scrollViewProps={{ disabled: true }}
      hideTouchable={true}
      containerStyles={styles.containerStyles}
      titleDom="Search">
      <InputWithCancel
        ref={iptRef}
        clearText={() => setKeyword('')}
        onChangeText={v => setKeyword(v)}
        value={keyword}
        onCancel={() => navigationService.goBack()}
      />
      <FindMoreButton />

      <FlatList
        data={filterList}
        ListHeaderComponent={
          debounceKeyword && filterList.length > 0 ? <TextL style={styles.listHeader}>Chats</TextL> : null
        }
        ListEmptyComponent={debounceKeyword ? <NoData noPic message="No search result" /> : null}
        renderItem={renderItem}
      />
    </PageContainer>
  );
}

const styles = StyleSheet.create({
  containerStyles: {
    backgroundColor: defaultColors.bg1,
    paddingHorizontal: 0,
    flex: 1,
  },
  listHeader: {
    ...GStyles.paddingArg(16, 20, 8),
    color: defaultColors.font9,
  },
  itemWrap: {
    width: screenWidth,
    height: pTd(72),
  },
  avatarStyle: {
    marginHorizontal: pTd(20),
    marginVertical: pTd(18),
  },
  rightSection: {
    height: pTd(72),
    flex: 1,
    borderBottomColor: defaultColors.border1,
    borderBottomWidth: StyleSheet.hairlineWidth,
    paddingRight: pTd(20),
    justifyContent: 'center',
  },
});
