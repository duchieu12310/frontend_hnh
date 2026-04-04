import React from 'react';
import { Switch,  Button, Divider, Grid, Group, Paper, Select, Stack, TextInput  } from '@mantine/core';
import { CreateUpdateTitle, DefaultPropertyPanel } from 'components';
import JobTitleConfigs from 'pages/job-title/JobTitleConfigs';
import useJobTitleCreateViewModel from 'pages/job-title/JobTitleCreate.vm';

function JobTitleCreate() {
  const {
    form,
    handleFormSubmit,
    statusSelectList,
  } = useJobTitleCreateViewModel();

  return (
    <Stack sx={{ maxWidth: 800 }}>
      <CreateUpdateTitle
        managerPath={JobTitleConfigs.managerPath}
        title={JobTitleConfigs.createTitle}
      />

      <DefaultPropertyPanel/>

      <form onSubmit={handleFormSubmit}>
        <Paper shadow="xs">
          <Stack spacing={0}>
            <Grid p="sm">
              <Grid.Col xs={6}>
                <TextInput
                  required
                  label={JobTitleConfigs.properties.name.label}
                  {...form.getInputProps('name')}
                />
              </Grid.Col>
              <Grid.Col xs={6}>
                <Switch
                  size="md"
                  label={JobTitleConfigs.properties.status.label}
                  checked={form.values.status === '1'}
                  onChange={(event) => form.setFieldValue('status', event.currentTarget.checked ? '1' : '0')}
                />
              </Grid.Col>
            </Grid>

            <Divider mt="xs"/>

            <Group position="apart" p="sm">
              <Button variant="default" onClick={form.reset}>Mặc định</Button>
              <Button type="submit">Thêm</Button>
            </Group>
          </Stack>
        </Paper>
      </form>
    </Stack>
  );
}

export default JobTitleCreate;
