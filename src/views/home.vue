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
                <div style="font-size: 14px; color: #272727; margin: 15px 0px 5px 0px" v-if="type == 'image'">
                    {{ $t('imageTip') }}
                </div>
                <div style="font-size: 14px; color: #272727; margin: 15px 0px 5px 0px" v-if="type == 'video'">
                    {{ $t('videoTip') }}
                </div>
                <div style="font-size: 12px; margin-top: 5px; color: #606266" v-if="type == 'image'">
                    {{ $t('imageSupport') }}
                </div>
                <div style="font-size: 12px; margin-top: 5px; color: #606266" v-if="type == 'video'">
                    {{ $t('videoSupport') }}
                </div>
            </div>
            <div v-else style="width: 560px; height: 470px; box-sizing: border-box; padding-top: 5px; overflow: auto">
                <div
                    v-for="(file, index) in fileList"
                    :key="index"
                    style="
                        display: flex;
                        font-size: 13px;
                        color: #666;
                        border-radius: 16px;
                        background-color: #fff;
                        height: 100px;
                        box-sizing: border-box;
                        align-items: center;
                        padding: 15px;
                        margin-bottom: 15px;
                    "
                >
                    <div
                        style="
                            display: flex;
                            justify-content: center;
                            align-items: center;
                            width: 115px;
                            height: 70px;
                            background-color: #000;
                            border-radius: 4px;
                        "
                    >
                        <img :src="file.data" style="max-height: 70px" />
                    </div>
                    <div
                        style="
                            flex: 1;
                            display: flex;
                            flex-direction: column;
                            margin-left: 20px;
                            height: 75px;
                            box-sizing: border-box;
                            justify-content: space-around;
                        "
                    >
                        <div
                            style="font-size: 16px; color: #000; font-weight: bold; display: flex; align-items: center"
                        >
                            <div style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis; width: 280px">
                                {{ file.name }}
                            </div>
                            <i
                                class="el-icon-success"
                                style="color: #67c23a; font-size: 24px; margin-left: 10px"
                                v-if="file.status == 'end'"
                            ></i>
                            <el-progress
                                type="circle"
                                :percentage="file.percentage"
                                :stroke-width="3"
                                :width="30"
                                style="margin-left: 10px"
                                v-if="type === 'video' && (file.status == 'doing' || file.status == 'pause')"
                            ></el-progress>
                        </div>
                        <div style="display: flex; align-items: center">
                            <div
                                style="
                                    background-color: #f3f1f2;
                                    border-radius: 8px;
                                    padding: 3px 16px;
                                    width: 70px;
                                    text-align: center;
                                    color: #fff;
                                    margin-right: 10px;
                                    font-size: 11px;
                                "
                            >
                                <div style="color: #7a7975">{{ $t('originalSize') }}</div>
                                <div style="color: #000; font-weight: bold">{{ formatSize(file.sourceSize) }}</div>
                            </div>
                            <div
                                style="
                                    background-color: #f3f1f2;
                                    border-radius: 8px;
                                    padding: 3px 12px;
                                    width: 80px;
                                    text-align: center;
                                    color: #fff;
                                    margin-right: 10px;
                                    font-size: 11px;
                                "
                            >
                                <div style="color: #7a7975">{{ $t('optimizedSize') }}</div>
                                <div style="color: #000; font-weight: bold">{{ formatSize(file.targetSize) }}</div>
                            </div>
                            <div
                                style="
                                    background-color: #f3f1f2;
                                    border-radius: 8px;
                                    padding: 3px 16px;
                                    width: 70px;
                                    text-align: center;
                                    color: #fff;
                                    margin-right: 10px;
                                    font-size: 11px;
                                "
                            >
                                <div style="color: #7a7975">{{ $t('compression') }}</div>
                                <div style="color: #000; font-weight: bold">
                                    {{ formatCompression(file) }}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div>
                        <i
                            class="el-icon-video-pause"
                            style="cursor: pointer; font-size: 20px; margin-right: 10px"
                            v-if="type === 'video' && file.status == 'doing'"
                            @click="handlePause(index)"
                        ></i>
                        <i
                            class="el-icon-video-play"
                            style="cursor: pointer; font-size: 20px; margin-right: 10px"
                            v-if="type === 'video' && file.status == 'pause'"
                            @click="handleResume(index)"
                        ></i>
                        <i
                            class="el-icon-folder"
                            style="cursor: pointer; font-size: 20px; margin-right: 10px"
                            @click="handleFolder"
                            v-if="file.status == 'end'"
                        ></i>
                        <i
                            class="el-icon-circle-close"
                            style="cursor: pointer; font-size: 20px"
                            @click="handleDelete(index)"
                        ></i>
                    </div>
                </div>
            </div>
        </div>
        <div
            style="
                width: 281px;
                border: 1px solid #d7dae2;
                font-size: 12px;
                border-radius: 8px;
                padding: 8px 8px 12px 8px;
                box-sizing: border-box;
            "
        >
            <div>
                <el-radio-group
                    v-model="type"
                    size="mini"
                    @input="handleSwitchType"
                    fill="#272727"
                    text-color="#ffffff"
                >
                    <el-radio-button label="image">{{ $t('image') }}</el-radio-button>
                    <el-radio-button label="video">{{ $t('video') }}</el-radio-button>
                </el-radio-group>
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
                <span style="width: 112px">{{ $t('ouputFolder') }}</span>
                <el-input placeholder="Please select a directory" v-model="outputDir" disabled size="mini">
                    <el-button slot="append" icon="el-icon-folder" @click="handleSetting"></el-button>
                </el-input>
            </div>
            <div
                style="
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    border-bottom: 1px solid #d7dae2;
                    height: 45px;
                "
                v-if="type === 'video'"
            >
                <span style="width: 112px">{{ $t('videoFormat') }}</span>
                <el-select v-model="videoFormat" size="mini" :popper-append-to-body="false">
                    <el-option :label="$t('videoFormatValue')" :value="$t('videoFormatValue')"> </el-option>
                    <el-option label="mp4" value="mp4"> </el-option>
                    <!-- <el-option v-for="item in videoAccept" :key="item" :label="item" :value="item"> </el-option> -->
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
                v-if="type === 'image'"
            >
                <span style="width: 112px">{{ $t('imageFormat') }}</span>
                <el-select v-model="imageFormat" size="mini" :popper-append-to-body="false">
                    <el-option :label="$t('imageFormatValue')" :value="$t('imageFormatValue')"> </el-option>
                    <el-option v-for="item in imagesAccept" :key="item" :label="item" :value="item"> </el-option>
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
                v-if="type === 'video'"
            >
                <span style="width: 112px">{{ $t('videoQuality') }}</span>
                <el-select v-model="videoQuality" size="mini" :popper-append-to-body="false">
                    <el-option
                        v-for="item in videoQualityOptions"
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
                v-if="type === 'image'"
            >
                <span style="width: 112px">{{ $t('imageQuality') }}</span>
                <el-select v-model="imageQuality" size="mini" :popper-append-to-body="false">
                    <el-option v-for="item in imageQualityOptions" :key="item" :label="item" :value="item"> </el-option>
                </el-select>
            </div>
            <!-- <div style="height: 45px; border-bottom: 1px solid #d7dae2; padding: 10px 0 10px 0" v-if="type === 'video'">
                <div>FPS {{ fps }}</div>
                <el-slider v-model="fps"></el-slider>
            </div> -->
            <!-- <div
                style="
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    border-bottom: 1px solid #d7dae2;
                    height: 45px;
                "
                v-if="type === 'video'"
            >
                <span style="width: 112px">{{ $t('dimension') }}</span>
                <el-select v-model="dimension" size="mini" :popper-append-to-body="false">
                    <el-option :label="$t('dimensionValue')" :value="$t('dimensionValue')"> </el-option>
                    <el-option
                        v-for="item in dimensionOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                    >
                    </el-option>
                </el-select>
            </div> -->
        </div>
        <!-- <el-dropdown style="position: fixed; left: 555px; bottom: 18px" @command="handleCommand" size="medium">
            <span class="el-dropdown-link">
                <img style="width: 22px; height: 22px" src="@/assets/langs.png" />
            </span>
            <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="zh">中文</el-dropdown-item>
                <el-dropdown-item command="en">English</el-dropdown-item>
            </el-dropdown-menu>
        </el-dropdown> -->
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
export default {
    data() {
        return {
            type: 'image',
            clientHeight: document.documentElement.clientHeight || document.body.clientHeight,
            fileList: [],
            videoAccept: ['mov', 'mp4', 'm4v', 'mpeg', 'wmv', 'mkv', 'rmvb', 'avi', 'flv', 'webm'],
            imagesAccept: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'tif', 'tiff', 'avif', 'heif'],
            outputDir: '',
            ffmpegList: [],
            imageFormat: '',
            imageQuality: 75,
            imageQualityOptions: [95, 85, 75, 65, 55, 45, 35, 25, 15, 10],
            videoFormat: '',
            videoQuality: 28,
            videoQualityOptions: [
                { value: 20, label: 'highest' },
                { value: 23, label: 'high' },
                { value: 26, label: 'good' },
                { value: 28, label: 'medium' },
                { value: 30, label: 'acceptable' }
            ],
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
            fps: 15,
            timestampList: [],
            isPay: false,
            isFfmpeg: false,
            licenseVisible: false,
            licenseKey: ''
        }
    },
    mounted() {
        this.isPay = localStorage.getItem('isPay') || false
        let message = this.$i18n.messages[this.$i18n.locale]
        this.imageFormat = message.imageFormatValue
        this.videoFormat = message.videoFormatValue
        this.dimension = message.dimensionValue

        let outputDir = localStorage.getItem('outputDir')
        if (outputDir) {
            this.outputDir = outputDir
        } else {
            this.getDesktopPath()
        }
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
                    this.walkDir(files[i].path)
                }
            } else {
                this.licenseKey = ''
                this.licenseVisible = true
            }
        })
    },
    methods: {
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
        async getFfmpegPath() {
            let result = await window.ipcRenderer.invoke('getFfmpegPath')
            ffmpeg.setFfmpegPath(result.ffmpegPath)
            ffmpeg.setFfprobePath(result.ffprobePath)
            this.isFfmpeg = true
        },
        async getDesktopPath() {
            let result = await window.ipcRenderer.invoke('getDesktopPath')
            this.outputDir = result
            localStorage.setItem('outputDir', result)
        },
        async handleClick() {
            if (!this.isFfmpeg) {
                this.getFfmpegPath()
            }
            if (this.isPay) {
                let filePaths = await window.ipcRenderer.invoke('dialog:openFile')
                if (filePaths) {
                    for (let i = 0; i < filePaths.length; i++) {
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
            this.dimension = message.dimensionValue
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
        async handleFolder() {
            await window.ipcRenderer.invoke('openPath', this.outputDir)
        },
        async handleSetting() {
            let result = await window.ipcRenderer.invoke('dialog:openDirectory')
            if (result) {
                this.outputDir = result
                localStorage.setItem('outputDir', result)
            }
        },
        walkDir(dir) {
            let lstatSync = fs.lstatSync(dir)
            if (lstatSync.isDirectory()) {
                fs.readdirSync(dir).forEach(item => {
                    let fullPath = path.join(dir, item)
                    let stat = fs.lstatSync(fullPath)
                    if (stat.isDirectory()) {
                        this.walkDir(fullPath)
                    } else {
                        let format = fullPath.substr(fullPath.lastIndexOf('.') + 1).toLocaleLowerCase()
                        if (this.type === 'image' && this.imagesAccept.includes(format)) {
                            let that = this
                            fs.readFile(fullPath, function (err, data) {
                                if (err) return console.log(err)
                                that.fileList.push({
                                    source: fullPath,
                                    sourceSize: stat.size,
                                    targetSize: '',
                                    name: item,
                                    type: that.type,
                                    status: 'end',
                                    data: 'data:image/png;base64,' + data.toString('base64')
                                })
                                that.compressImages(that.fileList.length - 1, fullPath)
                            })
                        } else if (this.type === 'video' && this.videoAccept.includes(format)) {
                            let name = ''
                            if (this.videoFormat == 'Same as input') {
                                name = item
                            } else {
                                name = item.replace('.' + format, '.' + this.videoFormat)
                            }
                            this.fileList.push({
                                source: fullPath,
                                sourceSize: stat.size,
                                targetSize: '',
                                name: name,
                                type: this.type,
                                percentage: 0,
                                status: 'doing'
                            })
                            let currentTimestamp = Date.now()
                            this.timestampList.push(currentTimestamp)
                            this.compressVideo(currentTimestamp, fullPath)
                        }
                    }
                })
            } else {
                let format = path.extname(dir).substring(1).toLocaleLowerCase()
                if (this.type === 'image' && this.imagesAccept.includes(format)) {
                    let that = this
                    fs.readFile(dir, function (err, data) {
                        if (err) return console.log(err)
                        that.fileList.push({
                            source: dir,
                            sourceSize: lstatSync.size,
                            targetSize: '',
                            name: path.basename(dir),
                            type: that.type,
                            status: 'end',
                            data: 'data:image/png;base64,' + data.toString('base64')
                        })
                        that.compressImages(that.fileList.length - 1, dir)
                    })
                } else if (this.type === 'video' && this.videoAccept.includes(format)) {
                    let name = ''
                    if (this.videoFormat == 'Same as input') {
                        name = path.basename(dir)
                    } else {
                        name = path.basename(dir).replace('.' + format, '.' + this.videoFormat)
                    }
                    this.fileList.push({
                        source: dir,
                        sourceSize: lstatSync.size,
                        targetSize: '',
                        name: name,
                        type: this.type,
                        percentage: 0,
                        status: 'doing'
                    })
                    let currentTimestamp = Date.now()
                    this.timestampList.push(currentTimestamp)
                    this.compressVideo(currentTimestamp, dir)
                }
            }
        },
        compressImages(index, inputPath) {
            let filename = path.basename(inputPath)
            let sourceFormat = inputPath.substr(inputPath.lastIndexOf('.') + 1).toLocaleLowerCase()
            const options = {
                quality: this.imageQuality
            }
            let command
            if (sourceFormat == 'gif') {
                command = sharp(inputPath, {
                    animated: true,
                    limitInputPixels: false
                })
            } else {
                command = sharp(inputPath)
            }
            if (this.imageFormat != 'Same as input') {
                command = command.toFormat(this.imageFormat)
            }
            if (sourceFormat == 'jpg' || sourceFormat == 'jpeg') {
                command = command.jpeg({
                    quality: options.quality,
                    mozjpeg: true
                })
            } else if (sourceFormat == 'png') {
                command = command.png({
                    quality: options.quality
                })
            } else if (sourceFormat == 'gif') {
                command = command.gif({
                    colours: parseInt((options.quality * 256) / 100, 10)
                })
            } else if (sourceFormat == 'webp') {
                command = command.webp({
                    quality: options.quality
                })
            } else if (sourceFormat == 'tif' || sourceFormat == 'tiff') {
                command = command.tiff({
                    quality: options.quality
                })
            } else if (sourceFormat == 'avif') {
                command = command.avif({
                    quality: options.quality
                })
            } else if (sourceFormat == 'heif') {
                command = command.heif({
                    quality: options.quality
                })
            }
            if (this.imageFormat == '原始格式' || this.imageFormat == 'Same as input') {
                command = command.toFile(this.outputDir + '/' + filename, (err, info) => {
                    if (err) {
                        console.error(err)
                    } else {
                        let item = this.fileList[index]
                        item.targetSize = info.size
                        this.$set(this.fileList, index, item)
                    }
                })
            } else {
                command = command.toFile(
                    this.outputDir + '/' + filename.replace('.' + sourceFormat, '.' + this.imageFormat),
                    (err, info) => {
                        if (err) {
                            console.error(err)
                        } else {
                            let item = this.fileList[index]
                            item.targetSize = info.size
                            this.$set(this.fileList, index, item)
                        }
                    }
                )
            }
        },
        compressVideo(timestamp, inputPath) {
            let filename = path.basename(inputPath)
            let index = this.timestampList.indexOf(timestamp)
            let item = this.fileList[index]
            if (this.videoFormat != 'Same as input') {
                filename = item.name
            }
            let that = this
            ffmpeg(inputPath)
                .outputOptions(['-frames:v 1'])
                .on('end', () => {
                    const imageBuffer = fs.readFileSync(this.outputDir + '/' + timestamp + '.png')
                    const base64Image = imageBuffer.toString('base64')
                    if (item) {
                        item.data = 'data:image/png;base64,' + base64Image
                        this.$set(that.fileList, index, item)
                    }
                    fs.unlinkSync(this.outputDir + '/' + timestamp + '.png')
                })
                .save(this.outputDir + '/' + timestamp + '.png')
            if (this.dimension == '原始分辨率' || this.dimension == 'Same as input') {
                let command = ffmpeg(inputPath)
                    .outputOptions(['-crf ' + this.videoQuality, '-preset veryfast'])
                    .output(this.outputDir + '/' + filename)
                    .on('progress', function (progress) {
                        if (progress.percent >= 100) {
                            item.percentage = 100
                        } else {
                            item.percentage = parseInt(progress.percent)
                        }
                        that.$set(that.fileList, index, item)
                    })
                    .on('end', () => {
                        console.log('完成')
                        ffmpeg(this.outputDir + '/' + filename).ffprobe((err, metadata) => {
                            item.targetSize = metadata.format.size
                            item.status = 'end'
                            this.$set(this.fileList, index, item)
                        })
                    })
                    .on('error', () => {
                        console.log('error')
                    })
                    .run()
                this.$set(this.ffmpegList, this.timestampList.indexOf(timestamp), command)
            } else {
                let command = ffmpeg(inputPath)
                    .size(this.dimension)
                    .autopad()
                    .outputOptions(['-crf ' + this.videoQuality, '-preset veryfast'])
                    .output(this.outputDir + '/' + filename)
                    .on('progress', function (progress) {
                        if (progress.percent >= 100) {
                            item.percentage = 100
                        } else {
                            item.percentage = parseInt(progress.percent)
                        }
                        that.$set(that.fileList, index, item)
                    })
                    .on('end', () => {
                        console.log('完成')
                        ffmpeg(this.outputDir + '/' + filename).ffprobe((err, metadata) => {
                            item.targetSize = metadata.format.size
                            item.status = 'end'
                            this.$set(this.fileList, index, item)
                        })
                    })
                    .on('error', () => {
                        console.log('error')
                    })
                    .run()
                this.$set(this.ffmpegList, this.timestampList.indexOf(timestamp), command)
            }
        },
        formatConvert(inputPath, targetFormat) {
            let sourceFormat = inputPath.substr(inputPath.lastIndexOf('.') + 1).toLocaleLowerCase()
            let command = sharp(inputPath)
            if (targetFormat == 'jpg' || targetFormat == 'jpeg') {
                if (sourceFormat == 'gif' || sourceFormat == 'png') {
                    command = command.flatten({ background: '#ffffff' })
                }
                command = command.jpeg()
            } else if (targetFormat == 'png') {
                command = command.png()
            } else if (targetFormat == 'gif') {
                command = command.gif()
            } else if (targetFormat == 'webp') {
                command = command.webp()
            } else if (targetFormat == 'tif' || targetFormat == 'tiff') {
                if (sourceFormat == 'gif' || sourceFormat == 'png') {
                    command = command.flatten({ background: '#ffffff' })
                }
                command = command.tiff()
            } else if (targetFormat == 'avif') {
                command = command.avif()
            } else if (targetFormat == 'heif') {
                command = command.heif()
            }
            command = command.toFile(outputPath, (err, info) => {
                if (err) {
                    console.error(err)
                } else {
                    console.log(info)
                }
            })
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
        },
        formatCompression(file) {
            if (file.targetSize) {
                return parseInt(((file.sourceSize - file.targetSize) / file.sourceSize) * 100) + ' %'
            } else {
                return '-'
            }
        },
        handleSwitchType() {
            this.fileList = []
            this.ffmpegList = []
            this.timestampList = []
        }
    }
}
</script>

<style scoped>
.flex-container {
    width: 100%;
    display: flex;
    padding: 15px 15px 15px 0px;
    box-sizing: border-box;
    background-color: #f3f1f2;
}
.draggable {
    border-radius: 8px;
    width: 570px;
    height: 470px;
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
</style>
