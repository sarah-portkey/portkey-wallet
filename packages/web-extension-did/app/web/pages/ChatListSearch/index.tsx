import { useCallback, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { useDebounceCallback } from '@portkey-wallet/hooks';
import SettingHeader from 'pages/components/SettingHeader';
import CustomSvg from 'components/CustomSvg';
import { useLoading } from 'store/Provider/hooks';
import DropdownSearch from 'components/DropdownSearch';
import { useCreateP2pChannel, useSearchChannel } from '@portkey-wallet/hooks/hooks-ca/im';
import ContactList from 'pages/Contacts/components/ContactList';
import { ContactItemType } from '@portkey-wallet/types/types-ca/contact';
import { message } from 'antd';
import './index.less';

export default function ChatListSearch() {
  const { t } = useTranslation();
  const { state } = useLocation();
  const [filterWord, setFilterWord] = useState<string>('');
  const navigate = useNavigate();
  const { setLoading } = useLoading();
  const [chatList, setChatList] = useState<ContactItemType[]>([]);
  const searchChannel = useSearchChannel();
  const createChannel = useCreateP2pChannel();

  const handleSearch = useCallback(
    async (keyword: string) => {
      if (!keyword) {
        setChatList([]);
      } else {
        try {
          const res = await searchChannel(keyword);
          const transRes = res.data.list.map((item) => ({
            id: item.channelUuid,
            index: item.displayName.slice(0, 1).toUpperCase(),
            name: item.displayName,
            addresses: [],
            modificationTime: 0,
            isDeleted: false,
            userId: '',
            isImputation: false,
          }));
          setChatList(transRes);
        } catch (e) {
          setChatList([]);
        }
      }
    },
    [searchChannel],
  );

  useEffect(() => {
    setFilterWord(state?.search || '');
  }, [state?.search]);

  const searchDebounce = useDebounceCallback(
    async (params) => {
      setLoading(true);
      await handleSearch(params);
      setLoading(false);
    },
    [filterWord],
    500,
  );
  const handleClick = useCallback(
    async (item: ContactItemType) => {
      try {
        const res = await createChannel(item?.imInfo?.relationId || '');
        console.log('res', res);
        navigate(`/chat-box/${res.data.channelUuid}`);
      } catch (e) {
        message.error('cannot chat');
      }
    },
    [createChannel, navigate],
  );

  return (
    <div className="chat-list-search-page flex-column">
      <div className="chat-list-search">
        <SettingHeader
          title={t('Search')}
          leftCallBack={() => navigate('/chat-list')}
          rightElement={<CustomSvg type="Close2" onClick={() => navigate('/chat-list')} />}
        />
        <DropdownSearch
          overlay={<></>}
          value={filterWord}
          inputProps={{
            onChange: (e) => {
              const _value = e.target.value.replaceAll(' ', '');
              setFilterWord(_value);
              searchDebounce(_value);
            },
            placeholder: 'Search chats',
          }}
        />
      </div>
      <div
        className="find-more flex"
        onClick={() => navigate(`/setting/contacts/find-more`, { state: { search: filterWord, from: 'chat-search' } })}>
        <CustomSvg type="AddContact" />
        Find More
      </div>
      <div className="chat-list-search-content">
        {chatList.length === 0 ? (
          <div className="search-empty flex-center">{filterWord ? 'No search result' : ''}</div>
        ) : (
          <div className="search-result-list">
            <div className="chat-title-text">Chats</div>
            <ContactList hasChatEntry={false} list={chatList} clickItem={handleClick} />
          </div>
        )}
      </div>
    </div>
  );
}
