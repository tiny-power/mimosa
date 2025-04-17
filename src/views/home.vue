<template>
    <div class="flex-container" :style="{ height: clientHeight + 'px' }">
        <div
            draggable="true"
            id="drop"
            style="flex: 1; display: flex; justify-content: center; align-items: center; flex-direction: column"
        >
            <div class="draggable" @click="handleClick(false)" v-if="fileList.length == 0">
                <div>
                    <i class="el-icon-download" style="font-size: 60px"></i>
                </div>
                <div style="font-size: 14px; color: #272727; margin: 15px 0px 5px 0px">
                    Tap to select videos、images、pdf or drop them here
                </div>
            </div>
            <div
                v-else
                :style="{
                    height: '470px',
                    overflow: 'auto',
                    display: 'grid',
                    'column-gap': '10px',
                    'row-gap': '10px',
                    'grid-template-rows': fileList.length === 1 ? '1fr' : '1fr 1fr',
                    'grid-template-columns':
                        fileList.length === 1 ? '1fr' : fileList.length === 2 ? '1fr 1fr' : '1fr 1fr 1fr',
                    'border-radius': '6px',
                    'background-color': '#e9eae9',
                    margin: '0px 15px',
                    padding: '10px',
                    'box-sizing': 'border-box'
                }"
            >
                <div
                    v-for="(item, index) in fileList"
                    :key="index"
                    :style="{
                        'background-color': '#969696',
                        'border-radius': '16px',
                        display: 'flex',
                        'justify-content': 'center',
                        'align-items': 'center',
                        width: fileList.length === 1 ? '680px' : fileList.length === 2 ? '335px' : '220px',
                        height: fileList.length === 1 ? '450px' : '220px',
                        position: 'relative'
                    }"
                >
                    <div
                        style="
                            top: 0.75rem;
                            left: 0.75rem;
                            padding: 0.25rem 0.75rem;
                            border-radius: 0.5rem;
                            background-color: hsla(0, 0%, 100%, 0.7);
                            position: absolute;
                            font-size: 13px;
                        "
                    >
                        {{
                            item.status === 'success'
                                ? item.format.toUpperCase() +
                                  ' | ' +
                                  formatSize(item.sourceSize) +
                                  ' | ' +
                                  formatSize(item.targetSize)
                                : item.format.toUpperCase() + ' | ' + formatSize(item.sourceSize)
                        }}
                    </div>
                    <img
                        :src="item.base64"
                        style="width: 100%; height: 100%; object-fit: cover; border-radius: 0.5rem"
                    />
                    <!-- <button
                        style="
                            background-color: #2b333fb3;
                            border: 0.06666em solid #fff;
                            cursor: pointer;
                            display: block;
                            font-size: 3em;
                            left: 50%;
                            line-height: 1.5em;
                            opacity: 1;
                            padding: 0;
                            position: absolute;
                            top: 50%;
                            width: 50px;
                            height: 50px;
                            border-radius: 50%;
                            margin-top: -0.5em;
                            margin-left: -0.5em;
                        "
                        v-if="item.type === 'video'"
                    >
                        <span
                            class="vjs-icon"
                            style="
                                font-size: 32px;
                                position: relative;
                                top: -13px;
                                left: 1px;
                                font-family: VideoJS;
                                font-weight: 400;
                                color: #fff;
                            "
                        ></span>
                    </button> -->
                </div>
            </div>
        </div>
        <div>
            <div
                style="
                    width: 260px;
                    border: 1px solid #d7dae2;
                    font-size: 12px;
                    border-radius: 8px;
                    padding: 0px 8px 0px 8px;
                    box-sizing: border-box;
                    margin-bottom: 10px;
                    background-color: #eeeced;
                "
            >
                <div
                    style="
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        border-bottom: 1px solid #d7dae2;
                        height: 45px;
                    "
                >
                    <span style="width: 124px">{{ $t('imageFormat') }}</span>
                    <el-select v-model="imageFormat" size="mini" :popper-append-to-body="false" :disabled="disabled">
                        <el-option
                            v-for="item in imageFormatOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                        >
                        </el-option>
                    </el-select>
                </div>
                <div style="display: flex; justify-content: center; align-items: center; height: 45px">
                    <span style="width: 124px">{{ $t('imageQuality') }}</span>
                    <el-select v-model="imageQuality" size="mini" :popper-append-to-body="false" :disabled="disabled">
                        <el-option
                            v-for="item in imageQualityOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                        >
                        </el-option>
                    </el-select>
                </div>
            </div>
            <div
                style="
                    width: 260px;
                    border: 1px solid #d7dae2;
                    font-size: 12px;
                    border-radius: 8px;
                    padding: 0px 8px 0px 8px;
                    box-sizing: border-box;
                    margin-bottom: 10px;
                    background-color: #eeeced;
                "
            >
                <div
                    style="
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        border-bottom: 1px solid #d7dae2;
                        height: 45px;
                    "
                >
                    <span style="width: 124px">{{ $t('videoFormat') }}</span>
                    <el-select v-model="videoFormat" size="mini" :popper-append-to-body="false" :disabled="disabled">
                        <el-option
                            v-for="item in videoFormatOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                        >
                        </el-option>
                    </el-select>
                </div>
                <div
                    style="
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        border-bottom: 1px solid #d7dae2;
                        height: 45px;
                    "
                >
                    <span style="width: 124px">{{ $t('videoQuality') }}</span>
                    <el-select v-model="videoQuality" size="mini" :popper-append-to-body="false" :disabled="disabled">
                        <el-option
                            v-for="item in videoQualityOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                        >
                        </el-option>
                    </el-select>
                </div>
            </div>
            <div
                style="
                    width: 260px;
                    border: 1px solid #d7dae2;
                    font-size: 12px;
                    border-radius: 8px;
                    padding: 0px 8px 0px 8px;
                    box-sizing: border-box;
                    margin-bottom: 10px;
                    background-color: #eeeced;
                "
            >
                <div style="display: flex; justify-content: center; align-items: center; height: 45px">
                    <span style="width: 124px">PDF quality</span>
                    <el-select v-model="pdfQuality" size="mini" :popper-append-to-body="false" :disabled="disabled">
                        <el-option
                            v-for="item in pdfQualityOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                        >
                        </el-option>
                    </el-select>
                </div>
            </div>
            <div
                style="
                    width: 260px;
                    border: 1px solid #d7dae2;
                    font-size: 12px;
                    border-radius: 8px;
                    padding: 8px;
                    box-sizing: border-box;
                    margin-bottom: 10px;
                    background-color: #eeeced;
                "
                v-if="!disabled"
            >
                <div style="display: flex; justify-content: center; align-items: center">
                    <el-button
                        style="
                            width: 100%;
                            border-radius: 16px;
                            height: 42px;
                            border: none;
                            box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
                            color: #272727;
                        "
                        @click="handleCompress"
                        >Compress</el-button
                    >
                </div>
            </div>
            <div
                style="
                    width: 260px;
                    border: 1px solid #d7dae2;
                    font-size: 12px;
                    border-radius: 8px;
                    padding: 8px;
                    box-sizing: border-box;
                    background-color: #eeeced;
                    margin-bottom: 10px;
                "
                v-if="!disabled"
            >
                <div style="display: flex; justify-content: center; align-items: center">
                    <el-button
                        type="primary"
                        style="
                            width: 100%;
                            border-radius: 16px;
                            height: 42px;
                            border: none;
                            box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
                        "
                        @click="handleReset"
                        >Reset</el-button
                    >
                </div>
            </div>
            <div
                style="
                    width: 260px;
                    border: 1px solid #d7dae2;
                    font-size: 12px;
                    border-radius: 8px;
                    padding: 8px;
                    box-sizing: border-box;
                    background-color: #eeeced;
                "
                v-if="disabled && fileList.length != 0 && fileList.length != completeNumber"
            >
                <div style="display: flex; align-items: center">
                    <span style="width: 124px">Compressing</span>
                    <span style="flex: 1; text-align: right">{{
                        Math.floor((completeNumber / fileList.length) * 100) + '%'
                    }}</span>
                </div>
                <div
                    :style="{
                        'padding-left': completeNumber === 0 ? '8px' : '0px'
                    }"
                >
                    <el-slider v-model="slider" :show-tooltip="false" :max="1"></el-slider>
                </div>
            </div>
            <div
                style="
                    width: 260px;
                    border: 1px solid #d7dae2;
                    font-size: 12px;
                    border-radius: 8px;
                    padding: 8px;
                    box-sizing: border-box;
                    background-color: #eeeced;
                "
                v-if="fileList.length != 0 && fileList.length === completeNumber"
            >
                <div style="display: flex; align-items: center">
                    <span style="width: 124px">{{ 'Output files(' + fileList.length + ')' }}</span>
                    <span
                        style="
                            background-color: #fff;
                            padding: 4px;
                            border-radius: 6px;
                            flex: 1;
                            text-align: center;
                            cursor: pointer;
                        "
                        @click="handleOpenPath"
                        >Open in Finder</span
                    >
                </div>
            </div>
        </div>
        <el-dialog title="Activate License" :visible.sync="licenseVisible" center>
            <div>
                <el-input placeholder="XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX" v-model="licenseKey" clearable> </el-input>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" size="medium" @click="handleLicenseKey">Activate</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
const sharp = require('sharp')
const fs = require('fs')
const path = require('path')
const ffmpeg = require('fluent-ffmpeg')
import { ClientJS } from 'clientjs'
import { addAbortSignal } from 'stream'
export default {
    data() {
        return {
            clientHeight: document.documentElement.clientHeight || document.body.clientHeight,
            fileList: [],
            videoAccept: ['mov', 'mp4', 'm4v', 'mpeg', 'wmv', 'mkv', 'rmvb', 'avi', 'flv', 'webm'],
            imagesAccept: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'tif', 'tiff', 'avif', 'heif'],
            pdfAccept: ['pdf'],
            outputDir: '',
            ffmpegList: [],
            dimension: '',
            dimensionOptions: [
                { value: '7680x4320', label: '8K(7680x4320)' },
                { value: '3840x2160)', label: '4K(3840x2160)' },
                { value: '2560x1440', label: '2K(2560x1440)' },
                { value: '1920x1080', label: '1080p(1920x1080)' },
                { value: '1280x720', label: '720p(1280x720)' },
                { value: '640x480', label: '480p(640x480)' },
                { value: '480x360', label: '360p(480x360)' }
            ],
            timestampList: [],
            isPay: false,
            isFfmpeg: false,
            licenseVisible: false,
            licenseKey: '',
            imageFormat: 'same',
            imageFormatOptions: [
                { value: 'same', label: 'Same as input' },
                { value: 'webp', label: 'webp' },
                { value: 'jpg', label: 'jpg' },
                { value: 'png', label: 'png' }
            ],
            imageQuality: 75,
            imageQualityOptions: [
                { value: 75, label: 'highest' },
                { value: 65, label: 'high' },
                { value: 55, label: 'good' },
                { value: 45, label: 'medium' },
                { value: 35, label: 'acceptable' }
            ],
            videoFormat: 'same',
            videoFormatOptions: [
                { value: 'same', label: 'Same as input' },
                { value: 'mp4', label: 'mp4' },
                { value: 'webm', label: 'webm' }
            ],
            videoQuality: 28,
            videoQualityOptions: [
                { value: 20, label: 'highest' },
                { value: 23, label: 'high' },
                { value: 26, label: 'good' },
                { value: 28, label: 'medium' },
                { value: 30, label: 'acceptable' }
            ],
            pdfFormat: 'same',
            pdfQuality: 'ebook',
            pdfQualityOptions: [
                { value: 'prepress', label: 'best' },
                { value: 'printer', label: 'hight' },
                { value: 'ebook', label: 'balance' },
                { value: 'screen', label: 'low' } //default
            ],
            disabled: false,
            dirname: '',
            completeNumber: 0,
            slider: 0,
            ghostscriptFlag: false
        }
    },
    watch: {
        completeNumber(newVal, oldVal) {
            if (newVal === this.fileList.length) {
                this.disabled = false
            }
            this.slider = newVal / this.fileList.length
        }
    },
    mounted() {
        this.isPay = true //localStorage.getItem('isPay') || false
        document.getElementById('drop').addEventListener('dragover', event => {
            event.preventDefault()
        })
        document.getElementById('drop').addEventListener('drop', event => {
            event.preventDefault()
            if (!this.isFfmpeg) {
                this.getFfmpegPath()
            }
            const files = event.dataTransfer.files
            if (this.isPay) {
                for (let i = 0; i < files.length; i++) {
                    this.dirname = path.dirname(files[i].path)
                    this.walkDir(files[i].path)
                }
            } else {
                this.licenseKey = ''
                this.licenseVisible = true
            }
        })
    },
    methods: {
        handleCompress() {
            this.completeNumber = 0
            this.slider = 0
            if (this.fileList.length === 0) {
                this.disabled = false
            } else {
                this.disabled = true
            }
            for (let i = 0; i < this.fileList.length; i++) {
                let item = this.fileList[i]
                if (item.type === 'image') {
                    this.compressImage(i, item)
                } else if (item.type === 'video') {
                    this.compressVideo(i, item)
                } else if (item.type === 'pdf') {
                    this.compressPdf(i, item)
                }
            }
        },
        handleReset() {
            this.fileList = []
            this.completeNumber = 0
            this.slider = 0
        },
        handleLicenseKey() {
            if (this.licenseKey) {
                const client = new ClientJS()
                const params = {
                    product_id: 'Mimosa',
                    client_id: client.getFingerprint(),
                    license_code: this.licenseKey
                }
                this.$axios.get('verification_license', { params }).then(res => {
                    if (res.data.code == 200) {
                        this.isPay = true
                        localStorage.setItem('isPay', true)
                        this.licenseVisible = false
                    } else {
                        this.$message.error(res.data.msg)
                    }
                })
            }
        },
        handleOpenPath() {
            window.ipcRenderer.invoke('openPath', this.outputDir + '/mimosa')
        },
        async getFfmpegPath() {
            let result = await window.ipcRenderer.invoke('getFfmpegPath')
            ffmpeg.setFfmpegPath(result.ffmpegPath)
            ffmpeg.setFfprobePath(result.ffprobePath)
            this.outputDir = result.desktopPath
            this.ghostscriptFlag = result.ghostscriptFlag
            this.isFfmpeg = true
        },
        async handleClick() {
            if (!this.isFfmpeg) {
                this.getFfmpegPath()
            }
            if (this.isPay) {
                let filePaths = await window.ipcRenderer.invoke('dialog:openFile')
                if (filePaths) {
                    for (let i = 0; i < filePaths.length; i++) {
                        this.dirname = path.dirname(filePaths[i])
                        this.walkDir(filePaths[i])
                    }
                }
            } else {
                this.licenseKey = ''
                this.licenseVisible = true
            }
        },
        handleCommand(command) {
            this.$i18n.locale = command
            localStorage.setItem('lang', command)
            let message = this.$i18n.messages[this.$i18n.locale]
            this.imageFormat = message.imageFormatValue
            this.videoFormat = message.videoFormatValue
        },
        handlePause(index) {
            let command = this.ffmpegList[index]
            command.kill('SIGSTOP')
            let item = this.fileList[index]
            item.status = 'pause'
            this.$set(this.fileList, index, item)
        },
        handleResume(index) {
            let command = this.ffmpegList[index]
            command.kill('SIGCONT')
            let item = this.fileList[index]
            item.status = 'doing'
            this.$set(this.fileList, index, item)
        },
        handleDelete(index) {
            let item = this.fileList[index]
            if (item.type === 'video') {
                let command = this.ffmpegList[index]
                command.kill()
                this.timestampList.splice(index, 1)
                this.ffmpegList.splice(index, 1)
                this.fileList.splice(index, 1)
                fs.unlinkSync(this.outputDir + '/' + item.name)
            } else if (item.type === 'image') {
                this.fileList.splice(index, 1)
            }
        },
        async walkDir(dir) {
            let lstatSync = fs.lstatSync(dir)
            if (lstatSync.isDirectory()) {
                fs.readdirSync(dir).forEach(async item => {
                    let fullPath = path.join(dir, item)
                    let stat = fs.lstatSync(fullPath)
                    if (stat.isDirectory()) {
                        this.walkDir(fullPath)
                    } else {
                        let format = path.extname(fullPath).substring(1).toLocaleLowerCase()
                        if (this.imagesAccept.includes(format)) {
                            let that = this
                            fs.readFile(fullPath, (err, data) => {
                                if (err) return console.log(err)
                                that.fileList.push({
                                    type: 'image',
                                    name: item,
                                    format: format,
                                    sourcePath: fullPath,
                                    sourceSize: stat.size,
                                    targetPath: '',
                                    targetSize: '',
                                    percentage: 0,
                                    status: 'prepare',
                                    base64: 'data:image/png;base64,' + data.toString('base64')
                                })
                            })
                        } else if (this.videoAccept.includes(format)) {
                            let that = this
                            fs.mkdir(this.dirname, { recursive: true }, err => {
                                if (err) {
                                    console.error(err)
                                    return
                                }
                            })
                            const timestamp = Date.now()
                            ffmpeg(fullPath)
                                .outputOptions(['-frames:v 1'])
                                .on('end', () => {
                                    let data = fs.readFileSync(this.dirname + '/' + timestamp + '.png')
                                    that.fileList.push({
                                        type: 'video',
                                        name: item,
                                        format: format,
                                        sourcePath: fullPath,
                                        sourceSize: stat.size,
                                        targetPath: '',
                                        targetSize: '',
                                        percentage: 0,
                                        status: 'prepare',
                                        base64: 'data:image/png;base64,' + data.toString('base64')
                                    })
                                    fs.unlinkSync(this.dirname + '/' + timestamp + '.png')
                                })
                                .save(this.dirname + '/' + timestamp + '.png')
                        } else if (this.pdfAccept.includes(format) && this.ghostscriptFlag) {
                            let that = this
                            fs.mkdir(this.dirname, { recursive: true }, err => {
                                if (err) {
                                    console.error(err)
                                    return
                                }
                            })
                            const timestamp = Date.now()
                            let outputPath = this.dirname + '/' + timestamp + '.png'
                            let result = await window.ipcRenderer.invoke('pdfToImage', fullPath, outputPath)
                            if (result) {
                                let data = fs.readFileSync(outputPath)
                                this.fileList.push({
                                    type: 'pdf',
                                    name: item,
                                    format: format,
                                    sourcePath: fullPath,
                                    sourceSize: stat.size,
                                    targetPath: '',
                                    targetSize: '',
                                    percentage: 0,
                                    status: 'prepare',
                                    base64: 'data:image/png;base64,' + data.toString('base64')
                                })
                                fs.unlinkSync(outputPath)
                            }
                        }
                    }
                })
            } else {
                let format = path.extname(dir).substring(1).toLocaleLowerCase()
                if (this.imagesAccept.includes(format)) {
                    let that = this
                    fs.readFile(dir, (err, data) => {
                        if (err) return console.log(err)
                        that.fileList.push({
                            type: 'image',
                            name: path.basename(dir),
                            format: format,
                            sourcePath: dir,
                            sourceSize: lstatSync.size,
                            targetPath: '',
                            targetSize: '',
                            percentage: 0,
                            status: 'prepare',
                            base64: 'data:image/png;base64,' + data.toString('base64')
                        })
                    })
                } else if (this.videoAccept.includes(format)) {
                    let that = this
                    fs.mkdir(this.dirname, { recursive: true }, err => {
                        if (err) {
                            console.error(err)
                            return
                        }
                    })
                    const timestamp = Date.now()
                    ffmpeg(dir)
                        .outputOptions(['-frames:v 1'])
                        .on('end', () => {
                            let data = fs.readFileSync(this.dirname + '/' + timestamp + '.png')
                            that.fileList.push({
                                type: 'video',
                                name: path.basename(dir),
                                format: format,
                                sourcePath: dir,
                                sourceSize: lstatSync.size,
                                targetPath: '',
                                targetSize: '',
                                percentage: 0,
                                status: 'prepare',
                                base64: 'data:image/png;base64,' + data.toString('base64')
                            })
                            fs.unlinkSync(this.dirname + '/' + timestamp + '.png')
                        })
                        .save(this.dirname + '/' + timestamp + '.png')
                } else if (this.pdfAccept.includes(format) && this.ghostscriptFlag) {
                    let that = this
                    fs.mkdir(this.dirname, { recursive: true }, err => {
                        if (err) {
                            console.error(err)
                            return
                        }
                    })
                    const timestamp = Date.now()
                    let outputPath = this.dirname + '/' + timestamp + '.png'

                    let result = await window.ipcRenderer.invoke('pdfToImage', dir, outputPath)
                    if (result) {
                        let data = fs.readFileSync(outputPath)
                        this.fileList.push({
                            type: 'pdf',
                            name: path.basename(dir),
                            format: format,
                            sourcePath: dir,
                            sourceSize: lstatSync.size,
                            targetPath: '',
                            targetSize: '',
                            percentage: 0,
                            status: 'prepare',
                            base64: 'data:image/png;base64,' + data.toString('base64')
                        })
                        fs.unlinkSync(outputPath)
                    }
                }
            }
        },
        compressImage(index, attribute) {
            const options = {
                quality: this.imageQuality
            }
            let command
            if (attribute.format == 'gif') {
                command = sharp(attribute.sourcePath, {
                    animated: true,
                    limitInputPixels: false
                })
            } else {
                command = sharp(attribute.sourcePath)
            }
            if (this.imageFormat != 'same') {
                command = command.toFormat(this.imageFormat)
            }
            if (attribute.format == 'jpg' || attribute.format == 'jpeg') {
                command = command.jpeg({
                    quality: options.quality,
                    mozjpeg: true
                })
            } else if (attribute.format == 'png') {
                command = command.png({
                    quality: options.quality
                })
            } else if (attribute.format == 'gif') {
                command = command.gif({
                    colours: parseInt((options.quality * 256) / 100, 10)
                })
            } else if (attribute.format == 'webp') {
                command = command.webp({
                    quality: options.quality
                })
            } else if (attribute.format == 'tif' || attribute.format == 'tiff') {
                command = command.tiff({
                    quality: options.quality
                })
            } else if (attribute.format == 'avif') {
                command = command.avif({
                    quality: options.quality
                })
            } else if (attribute.format == 'heif') {
                command = command.heif({
                    quality: options.quality
                })
            }
            let outputPath = this.outputDir + '/mimosa' + attribute.sourcePath.replace(this.dirname, '')
            if (this.imageFormat != 'same') {
                outputPath = outputPath.replace('.' + attribute.format, '.' + this.imageFormat)
            }
            fs.mkdir(path.dirname(outputPath), { recursive: true }, err => {
                if (err) {
                    console.error(err)
                    return
                }
            })
            command = command.toFile(outputPath, (err, info) => {
                if (err) {
                    console.error(err)
                    attribute.status = 'error'
                } else {
                    attribute.targetSize = info.size
                    attribute.targetPath = outputPath
                    attribute.status = 'success'
                }
                this.completeNumber = this.completeNumber + 1
                this.$set(this.fileList, index, attribute)
            })
        },
        compressVideo(index, attribute) {
            let that = this
            let outputPath = this.outputDir + '/mimosa' + attribute.sourcePath.replace(this.dirname, '')
            if (this.videoFormat != 'same') {
                outputPath = outputPath.replace('.' + attribute.format, '.' + this.videoFormat)
            }
            fs.mkdir(path.dirname(outputPath), { recursive: true }, err => {
                if (err) {
                    console.error(err)
                    return
                }
            })
            if (!this.dimension) {
                let command = ffmpeg(attribute.sourcePath)
                    .outputOptions(['-crf ' + this.videoQuality, '-preset veryfast'])
                    .output(outputPath)
                    .on('progress', progress => {
                        if (progress.percent >= 100) {
                            attribute.percentage = 100
                        } else {
                            attribute.percentage = parseInt(progress.percent)
                        }
                        that.$set(that.fileList, index, attribute)
                    })
                    .on('end', () => {
                        console.log('end')
                        ffmpeg(outputPath).ffprobe((err, metadata) => {
                            attribute.targetSize = metadata.format.size
                            attribute.status = 'success'
                            attribute.targetPath = outputPath
                            this.$set(this.fileList, index, attribute)
                            this.completeNumber = this.completeNumber + 1
                        })
                    })
                    .on('error', () => {
                        console.log('error')
                        attribute.status = 'error'
                        this.$set(this.fileList, index, attribute)
                        this.completeNumber = this.completeNumber + 1
                    })
                    .run()
                //this.$set(this.ffmpegList, this.timestampList.indexOf(timestamp), command)
            } else {
                let command = ffmpeg(attribute.sourcePath)
                    .size(this.dimension)
                    .autopad()
                    .outputOptions(['-crf ' + this.videoQuality, '-preset veryfast'])
                    .output(outputPath)
                    .on('progress', progress => {
                        if (progress.percent >= 100) {
                            attribute.percentage = 100
                        } else {
                            attribute.percentage = parseInt(progress.percent)
                        }
                        that.$set(that.fileList, index, attribute)
                    })
                    .on('end', () => {
                        console.log('end')
                        ffmpeg(outputPath).ffprobe((err, metadata) => {
                            attribute.targetSize = metadata.format.size
                            attribute.status = 'success'
                            attribute.targetPath = outputPath
                            this.$set(this.fileList, index, attribute)
                            this.completeNumber = this.completeNumber + 1
                        })
                    })
                    .on('error', () => {
                        console.log('error')
                        attribute.status = 'error'
                        this.$set(this.fileList, index, attribute)
                        this.completeNumber = this.completeNumber + 1
                    })
                    .run()
                //this.$set(this.ffmpegList, this.timestampList.indexOf(timestamp), command)
            }
        },
        async compressPdf(index, attribute) {
            let outputPath = this.outputDir + '/mimosa' + attribute.sourcePath.replace(this.dirname, '')
            if (this.pdfFormat != 'same') {
                outputPath = outputPath.replace('.' + attribute.format, '.' + this.imageFormat)
            }
            fs.mkdir(path.dirname(outputPath), { recursive: true }, err => {
                if (err) {
                    console.error(err)
                    return
                }
            })
            let result = await window.ipcRenderer.invoke(
                'compressPdf',
                attribute.sourcePath,
                outputPath,
                this.pdfQuality
            )
            if (result) {
                const stats = fs.statSync(outputPath)
                attribute.targetSize = stats.size
                attribute.targetPath = outputPath
                attribute.status = 'success'
            } else {
                attribute.status = 'error'
            }
            this.completeNumber = this.completeNumber + 1
            this.$set(this.fileList, index, attribute)
        },
        formatSize(numberOfBytes) {
            if (numberOfBytes) {
                const units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
                const exponent = Math.min(Math.floor(Math.log(numberOfBytes) / Math.log(1024)), units.length - 1)
                const approx = numberOfBytes / 1024 ** exponent
                if (exponent == 0 || exponent == 1) {
                    return approx.toFixed(0) + ' ' + units[exponent]
                } else {
                    return approx.toFixed(1) + ' ' + units[exponent]
                }
            } else {
                return '-'
            }
        }
    }
}
</script>

<style scoped>
.flex-container {
    width: 100%;
    display: flex;
    padding: 15px 14px 15px 0px;
    box-sizing: border-box;
    background-color: #f3f1f2;
}
.draggable {
    border-radius: 8px;
    width: 700px;
    height: 580px;
    color: #272727;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    background-color: #e2e0e2;
}
::v-deep .el-input.is-disabled .el-input__inner {
    background-color: #f3f1f2;
}
::v-deep .el-input__inner {
    padding: 0 7.7px;
    background-color: #f3f1f2;
    color: #272727;
}
::v-deep .el-input-group__append {
    background-color: #f3f1f2;
    padding: 0 8px;
}
::v-deep .el-input.is-disabled .el-input__inner {
    color: #606266;
}
::v-deep .el-select {
    width: 100%;
}
::v-deep .el-radio-group {
    width: 100%;
}
::v-deep .el-radio-button {
    width: 50%;
}
::v-deep .el-radio-button__inner {
    width: 100%;
}
::v-deep .el-radio-button__inner:hover {
    color: #272727;
}
::v-deep .el-slider__bar {
    background-color: #272727;
}
::v-deep .el-slider__button {
    border: 2px solid #272727;
}
::v-deep .el-select .el-input__inner:focus {
    border-color: #272727;
}
::v-deep .el-button--primary {
    background-color: #272727;
    border-color: #272727;
}
::v-deep .el-input__inner:focus {
    border-color: #272727;
}
::v-deep .el-select-dropdown__item.selected {
    color: #272727;
}
::v-deep .el-button:hover {
    color: #272727;
    background-color: #fff;
}
.vjs-icon:before {
    content: '\f101';
}
</style>
