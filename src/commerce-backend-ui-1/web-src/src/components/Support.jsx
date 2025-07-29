/*
Copyright 2024 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/
import {
    Heading,
    View,
    Grid,
    Link,
    Content,
    Text
} from '@adobe/react-spectrum'

const links = [
    { label: 'Blue Acorn iCi', url: 'https://blueacornici.shop/' },
    { label: 'Create an Issue', url: 'https://github.com/BlueAcornInc/aio-commerce-storelocator-blocks/issues/new' },
    { label: 'Issue Tracker', url: 'https://github.com/BlueAcornInc/aio-commerce-storelocator-blocks/issues' },
    { label: 'Contact Us', url: 'mailto:apps@blueacornici.com' },
    { label: 'Documentation', url: 'https://apps.blueacornici.shop/' },
]

export const Support = props => {
    return (
        <View paddingTop="size-400">
            <Grid
                columns={['1fr 1fr']}
                gap="size-200"
                width="size-3600"
            >
                {links.map(link => (
                    <View key={link.url} borderWidth="thin" borderColor="dark" padding="size-200" borderRadius="medium">
                        <a
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ textDecoration: 'none', color: 'inherit' }}
                        >
                            <Text>{link.label}</Text>
                        </a>
                    </View>
                ))}
            </Grid>
        </View>
    )
}
