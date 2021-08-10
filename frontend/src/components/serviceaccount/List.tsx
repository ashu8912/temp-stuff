import React from 'react';
import { useTranslation } from 'react-i18next';
import ServiceAccount from '../../lib/k8s/serviceAccount';
import { useFilterFunc } from '../../lib/util';
import Link from '../common/Link';
import { SectionBox } from '../common/SectionBox';
import SectionFilterHeader from '../common/SectionFilterHeader';
import SimpleTable from '../common/SimpleTable';

export default function ServiceAccountList() {
  const [serviceAccounts, error] = ServiceAccount.useList();
  const filterFunc = useFilterFunc();
  const { t } = useTranslation('glossary');

  return (
    <SectionBox title={<SectionFilterHeader title={t('Service Accounts')} />}>
      <SimpleTable
        rowsPerPage={[15, 25, 50]}
        filterFunction={filterFunc}
        errorMessage={ServiceAccount.getErrorMessage(error)}
        columns={[
          {
            label: t('frequent|Name'),
            getter: serviceAccount => <Link kubeObject={serviceAccount} />,
            sort: (s1: ServiceAccount, s2: ServiceAccount) => {
              if (s1.metadata.name < s2.metadata.name) {
                return -1;
              } else if (s1.metadata.name > s2.metadata.name) {
                return 1;
              }
              return 0;
            },
          },
          {
            label: t('glossary|Namespace'),
            getter: serviceAccount => serviceAccount.getNamespace(),
            sort: true,
          },
          {
            label: t('frequent|Age'),
            getter: serviceAccount => serviceAccount.getAge(),
            sort: (s1: ServiceAccount, s2: ServiceAccount) =>
              new Date(s2.metadata.creationTimestamp).getTime() -
              new Date(s1.metadata.creationTimestamp).getTime(),
          },
        ]}
        data={serviceAccounts}
        defaultSortingColumn={3}
      />
    </SectionBox>
  );
}
