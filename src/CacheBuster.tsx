import axios from 'axios';
import React from 'react';
import packageJson from '../package.json';
declare global {
    var appVersion: string;
 }
global.appVersion = packageJson.version

// version from response - first param, local version second param
const semverGreaterThan = (versionA: string, versionB: string) => {
    const versionsA = versionA.split(/\./g);

    const versionsB = versionB.split(/\./g);
    while (versionsA.length || versionsB.length) {
        const a = Number(versionsA.shift());

        const b = Number(versionsB.shift());
        // eslint-disable-next-line no-continue
        if (a === b) continue;
        // eslint-disable-next-line no-restricted-globals
        return a > b || isNaN(b);
    }
    return false;
};

export type CacheBusterState = { loading: boolean, isLatestVersion: boolean, refreshCacheAndReload: () => void }
class CacheBuster extends React.Component<any, CacheBusterState> {
    constructor(props: any) {
        super(props);
        this.state = {
            loading: true,
            isLatestVersion: false,
            refreshCacheAndReload: () => {
                console.log('Clearing cache and hard reloading...')
                if (caches) {
                    // Service worker cache should be cleared with caches.delete()
                    caches.keys().then(function (names) {
                        for (let name of names) caches.delete(name);
                    });
                }

                // delete browser cache and hard reload
                window.location.reload(true);
            }
        };
    }

    componentDidMount() {
        axios({ url: `/meta.json?as=${new Date().toString()}` })
            .then(({ data }) => {
                const latestVersion = data.version;
                const currentVersion = global.appVersion;

                const shouldForceRefresh = semverGreaterThan(latestVersion, currentVersion);
                if (shouldForceRefresh) {
                    console.log(`We have a new version - ${latestVersion}. Should force refresh`);
                    this.setState({ loading: false, isLatestVersion: false });
                } else {
                    console.log(`You already have the latest version - ${latestVersion}. No cache refresh needed.`);
                    this.setState({ loading: false, isLatestVersion: true });
                }
            })
    }
    render() {
        const { loading, isLatestVersion, refreshCacheAndReload } = this.state;
        if (!this.props.children) return (<></>)

        //@ts-ignore
        return this.props.children({ loading, isLatestVersion, refreshCacheAndReload });
    }
}

export default CacheBuster;