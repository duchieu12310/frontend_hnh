import React from 'react';
import { Switch,  Button, Divider, Grid, Group, MultiSelect, Paper, Select, Stack, TextInput  } from '@mantine/core';
import { CreateUpdateTitle, DefaultPropertyPanel } from 'components';
import WarehouseConfigs from 'pages/warehouse/WarehouseConfigs';
import useWarehouseCreateViewModel from 'pages/warehouse/WarehouseCreate.vm';
import WarehouseSelectionTree from './components/WarehouseSelectionTree';

function WarehouseCreate() {
  const {
    form,
    handleFormSubmit,
    provinceSelectList,
    districtSelectList,
    wardSelectList,
    treeMetadata,
    statusSelectList,
  } = useWarehouseCreateViewModel();

  return (
    <Stack>
      <CreateUpdateTitle
        managerPath={WarehouseConfigs.managerPath}
        title={WarehouseConfigs.createTitle}
      />

      <DefaultPropertyPanel/>

      <form onSubmit={handleFormSubmit}>
        <Paper shadow="xs">
          <Stack spacing={0}>
            <Grid p="sm">
              <Grid.Col xs={6}>
                <TextInput
                  required
                  label={WarehouseConfigs.properties.code.label}
                  {...form.getInputProps('code')}
                />
              </Grid.Col>
              <Grid.Col xs={6}>
                <TextInput
                  required
                  label={WarehouseConfigs.properties.name.label}
                  {...form.getInputProps('name')}
                />
              </Grid.Col>
              <Grid.Col>
                <TextInput
                  label={WarehouseConfigs.properties['address.line'].label}
                  {...form.getInputProps('address.line')}
                />
              </Grid.Col>
              <Grid.Col xs={4}>
                <Select
                  label={WarehouseConfigs.properties['address.provinceId'].label}
                  placeholder="--"
                  clearable
                  searchable
                  data={provinceSelectList}
                  {...form.getInputProps('address.provinceId')}
                />
              </Grid.Col>
              <Grid.Col xs={4}>
                <Select
                  label={WarehouseConfigs.properties['address.districtId'].label}
                  placeholder="--"
                  clearable
                  searchable
                  data={districtSelectList}
                  {...form.getInputProps('address.districtId')}
                />
              </Grid.Col>
              <Grid.Col xs={4}>
                <Select
                  label={WarehouseConfigs.properties['address.wardId'].label}
                  placeholder="--"
                  clearable
                  searchable
                  data={wardSelectList}
                  {...form.getInputProps('address.wardId')}
                />
              </Grid.Col>
              <Grid.Col>
                <WarehouseSelectionTree 
                  nodes={form.values.selectionTree}
                  onNodesChange={(nodes) => form.setFieldValue('selectionTree', nodes)}
                  metadata={treeMetadata}
                />
              </Grid.Col>
              <Grid.Col xs={6}>
                <Switch
                  size="md"
                  label={WarehouseConfigs.properties.status.label}
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

export default WarehouseCreate;
