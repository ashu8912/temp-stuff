import React from 'react';
import { useTranslation } from 'react-i18next';
import Secret from '../../lib/k8s/secret';
import { useFilterFunc } from '../../lib/util';
import Link from '../common/Link';
import { SectionBox } from '../common/SectionBox';
import SectionFilterHeader from '../common/SectionFilterHeader';
import SimpleTable from '../common/SimpleTable';

export default function SecretList() {
  const [secrets, error] = Secret.useList();
  const filterFunc = useFilterFunc();
  const { t } = useTranslation('glossary');

  return (
    <SectionBox title={<SectionFilterHeader title={t('Secrets')} />}>
      <SimpleTable
        rowsPerPage={[15, 25, 50]}
        filterFunction={filterFunc}
        errorMessage={Secret.getErrorMessage(error)}
        columns={[
          {
            label: t('frequent|Name'),
            getter: secret => <Link kubeObject={secret} />,
            sort: (s1: Secret, s2: Secret) => {
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
            getter: secret => secret.getNamespace(),
            sort: true,
          },
          {
            label: t('Type'),
            getter: secret => secret.type,
            sort: true,
          },
          {
            label: t('frequent|Age'),
            getter: secret => secret.getAge(),
            sort: (s1: Secret, s2: Secret) =>
              new Date(s2.metadata.creationTimestamp).getTime() -
              new Date(s1.metadata.creationTimestamp).getTime(),
          },
        ]}
        data={secrets}
        defaultSortingColumn={4}
      />
    </SectionBox>
  );
}
