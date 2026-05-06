import React, { useState } from 'react';
import { Switch,  Button, Divider, Grid, Group, Paper, Select, Stack, Textarea, TextInput, Modal  } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { CreateUpdateTitle, DefaultPropertyPanel } from 'components';
import PropertyConfigs from 'pages/property/PropertyConfigs';
import usePropertyCreateViewModel from 'pages/property/PropertyCreate.vm';

function PropertyCreate() {
  const [opened, { open, close }] = useDisclosure(false);
  const [rawText, setRawText] = useState('');

  const {
    form,
    handleFormSubmit,
    statusSelectList,
    smartImport,
    isAutoFilling,
  } = usePropertyCreateViewModel();

  return (
    <Stack sx={{ maxWidth: 800 }}>
      <CreateUpdateTitle
        managerPath={PropertyConfigs.managerPath}
        title={PropertyConfigs.createTitle}
      />

      <DefaultPropertyPanel/>

      <Modal opened={opened} onClose={close} title="✨ Nhập thuộc tính thông minh" size="lg">
        <Stack>
          <Textarea 
            placeholder="Dán thông tin thuộc tính vào đây..." 
            minRows={6}
            value={rawText}
            onChange={(e) => setRawText(e.currentTarget.value)}
          />
          <Group position="right">
            <Button variant="default" onClick={close}>Hủy</Button>
            <Button 
                loading={isAutoFilling} 
                onClick={async () => {
                    await smartImport(rawText);
                    close();
                    setRawText('');
                }}
            >
                Điền form
            </Button>
          </Group>
        </Stack>
      </Modal>

      <div className="flex justify-end mb-2">
        <Button 
            variant="light" 
            size="xs" 
            leftIcon={<span>✨</span>}
            onClick={open}
        >
            Nhập nhanh
        </Button>
      </div>

      <form onSubmit={handleFormSubmit}>
        <Paper shadow="xs">
          <Stack spacing={0}>
            <Grid p="sm">
              <Grid.Col xs={6}>
                <TextInput
                  required
                  label={PropertyConfigs.properties.name.label}
                  {...form.getInputProps('name')}
                />
              </Grid.Col>
              <Grid.Col xs={6}>
                <TextInput
                  required
                  label={PropertyConfigs.properties.code.label}
                  {...form.getInputProps('code')}
                />
              </Grid.Col>
              <Grid.Col>
                <Textarea
                  label={PropertyConfigs.properties.description.label}
                  {...form.getInputProps('description')}
                />
              </Grid.Col>
              <Grid.Col xs={6}>
                <Switch
                  size="md"
                  label={PropertyConfigs.properties.status.label}
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

export default PropertyCreate;
