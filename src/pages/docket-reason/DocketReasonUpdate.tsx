import React from 'react';
import { Switch,  Button, Divider, Grid, Group, Paper, Select, Stack, TextInput  } from '@mantine/core';
import { useParams } from 'react-router-dom';
import { CreateUpdateTitle, DefaultPropertyPanel } from 'components';
import DocketReasonConfigs from 'pages/docket-reason/DocketReasonConfigs';
import useDocketReasonUpdateViewModel from 'pages/docket-reason/DocketReasonUpdate.vm';

function DocketReasonUpdate() {
  const { id } = useParams();
  const {
    docketReason,
    form,
    handleFormSubmit,
    statusSelectList,
  } = useDocketReasonUpdateViewModel(Number(id));

  if (!docketReason) {
    return null;
  }

  return (
    <Stack sx={{ maxWidth: 800 }}>
      <CreateUpdateTitle
        managerPath={DocketReasonConfigs.managerPath}
        title={DocketReasonConfigs.updateTitle}
      />

      <DefaultPropertyPanel
        id={docketReason.id}
        createdAt={docketReason.createdAt}
        updatedAt={docketReason.updatedAt}
        createdBy="1"
        updatedBy="1"
      />

      <form onSubmit={handleFormSubmit}>
        <Paper shadow="xs">
          <Stack spacing={0}>
            <Grid p="sm">
              <Grid.Col xs={6}>
                <TextInput
                  required
                  label={DocketReasonConfigs.properties.name.label}
                  {...form.getInputProps('name')}
                />
              </Grid.Col>
              <Grid.Col xs={6}>
                <Switch
                  size="md"
                  label={DocketReasonConfigs.properties.status.label}
                  checked={form.values.status === '1'}
                  onChange={(event) => form.setFieldValue('status', event.currentTarget.checked ? '1' : '0')}
                />
              </Grid.Col>
            </Grid>

            <Divider mt="xs"/>

            <Group position="apart" p="sm">
              <Button variant="default" onClick={form.reset}>Mặc định</Button>
              <Button type="submit">Cập nhật</Button>
            </Group>
          </Stack>
        </Paper>
      </form>
    </Stack>
  );
}

export default DocketReasonUpdate;
